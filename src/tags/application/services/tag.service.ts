import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes } from 'crypto';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { CreateTagResultDto } from '../dto/create-tag-result.dto';
import { FindTagsFiltersDto, PaginatedResult } from '../dto/find-tags-filters.dto';
import { TagType } from '../../domain/enums/tag-type.enum';
import { UsersService } from '../../../users/application/services/users.service';

@Injectable()
export class TagService {
  private readonly pepper: string;

  constructor(
    private readonly tagRepository: TagRepository,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.pepper = this.configService.get<string>('TAG_PEPPER') || '';
    if (!this.pepper) {
      throw new Error('TAG_PEPPER environment variable is not set');
    }
  }

  /// Busca todos los tags activos
  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.findAll();
  }

  /// Obtiene credenciales con paginación y filtros
  async findAllWithFilters(filters: FindTagsFiltersDto): Promise<PaginatedResult<TagEntity>> {
    return await this.tagRepository.findAllWithFilters(filters);
  }

  /// Busca un tag por tagId o lanza una excepción si no se encuentra
  async findOne(tagId: number): Promise<TagEntity> {
    return await this.findTagByIdOrFail(tagId);
  }

  /// Busca un tag por tagCode o lanza una excepción si no se encuentra
  async findOneByTagCode(tagCode: string): Promise<TagEntity> {
    return await this.findTagByCodeOrFail(tagCode);
  }

  /// Crea un nuevo tag generando el tagCode según el tipo
  async create(createDto: CreateTagDto): Promise<CreateTagResultDto> {
    // Verificar que el usuario exista
    const user = await this.usersService.findOne(createDto.userId);

    // Validar rawUid si el tipo es RFID
    if (createDto.type === TagType.RFID) {
      if (!createDto.rawUid) {
        throw new BadRequestException('rawUid is required for RFID tags');
      }
    }

    if (createDto.type === TagType.NFC_MOBILE) {
      return this.createOrRegenerateMobileCredential(user);
    }

    const { tagCode, mobileCredential } = this.generateCredential(createDto.type, createDto.rawUid);

    // Verificar que el tagCode sea único
    await this.ensureTagCodeIsUnique(tagCode);

    // Crear el nuevo tag
    const tag = new TagEntity();
    tag.tagCode = tagCode;
    tag.user = user;
    tag.type = createDto.type;
    tag.isActive = true;

    // Guardar en la base de datos
    try {
      const savedTag = await this.tagRepository.save(tag);
      return { tag: savedTag, mobileCredential };
    } catch (error) {
      throw new ConflictException(`Tag could not be created`);
    }
  }

  /// Actualiza un tag existente y puede regenerar el tagCode
  async updateTagCode(tagId: number, updateDto: UpdateTagDto): Promise<TagEntity> {
    // Buscar el tag existente
    const tag = await this.findTagByIdOrFail(tagId);

    if (tag.type === TagType.NFC_MOBILE) {
      throw new BadRequestException('Las credenciales NFC móviles no se regeneran con rawUid');
    }

    if (!updateDto.rawUid) {
      throw new BadRequestException('rawUid es obligatorio para regenerar una credencial NFC física');
    }

    // Generar nuevo tagCode
    const newTagCode = this.hashCredential(updateDto.rawUid);
    await this.ensureTagCodeIsUnique(newTagCode, tagId);

    tag.tagCode = newTagCode;

    try {
      return await this.tagRepository.save(tag);
    } catch (error) {
      throw new ConflictException(`Tag could not be updated`);
    }
  }

  /// Desactiva un tag (soft delete)
  async softRemove(tagId: number): Promise<void> {
    const tag = await this.findActiveTagByIdOrFail(tagId);
    tag.isActive = false;
    await this.tagRepository.save(tag);
  }

  //? ================= Métodos auxiliares =================

  private generateCredential(type: TagType, rawUid?: string): { tagCode: string; mobileCredential?: string } {
    if (type === TagType.RFID) {
      if (!rawUid) {
        throw new BadRequestException('rawUid is required for RFID tag generation');
      }
      return { tagCode: this.hashCredential(rawUid) };
    }

    const mobileCredential = randomBytes(32).toString('base64url');
    return { tagCode: this.hashCredential(mobileCredential), mobileCredential };
  }

  private async createOrRegenerateMobileCredential(user: any): Promise<CreateTagResultDto> {
    const activeMobileTags = await this.tagRepository.findActiveByUserIdAndType(user.userId, TagType.NFC_MOBILE);
    const tagToUse = activeMobileTags[0];
    const duplicatedTags = activeMobileTags.slice(1);
    const { tagCode, mobileCredential } = this.generateCredential(TagType.NFC_MOBILE);

    await this.ensureTagCodeIsUnique(tagCode, tagToUse?.tagId);

    for (const duplicatedTag of duplicatedTags) {
      duplicatedTag.isActive = false;
      await this.tagRepository.save(duplicatedTag);
    }

    if (tagToUse) {
      tagToUse.tagCode = tagCode;
      tagToUse.issuedAt = new Date();
      tagToUse.isActive = true;
      tagToUse.user = tagToUse.user ?? user;
      tagToUse.userId = user.userId;

      try {
        const savedTag = await this.tagRepository.save(tagToUse);
        return { tag: savedTag, mobileCredential };
      } catch (error) {
        throw new ConflictException(`Tag could not be updated`);
      }
    }

    const tag = new TagEntity();
    tag.tagCode = tagCode;
    tag.user = user;
    tag.userId = user.userId;
    tag.type = TagType.NFC_MOBILE;
    tag.isActive = true;

    try {
      const savedTag = await this.tagRepository.save(tag);
      return { tag: savedTag, mobileCredential };
    } catch (error) {
      throw new ConflictException(`Tag could not be created`);
    }
  }

  //? Calcula HMAC-SHA256 y guarda solo los primeros 16 bytes en base64url
  private hashCredential(rawCredential: string): string {
    const hmac = createHmac('sha256', this.pepper);
    hmac.update(rawCredential);
    const hash = hmac.digest();
    return hash.subarray(0, 16).toString('base64url');
  }

  //? Busca un tag por tagId o lanza una excepción si no se encuentra
  private async findTagByIdOrFail(tagId: number): Promise<TagEntity> {
    const tag = await this.tagRepository.findOneById(tagId);
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }
    return tag;
  }

  //? Busca un tag por tagCode o lanza una excepción si no se encuentra
  private async findTagByCodeOrFail(tagCode: string): Promise<TagEntity> {
    const tag = await this.tagRepository.findOneByTagCode(tagCode);
    if (!tag) {
      throw new NotFoundException(`Tag with code ${tagCode} not found`);
    }
    return tag;
  }

  //? Busca un tag activo por tagId o lanza una excepción si no se encuentra
  private async findActiveTagByIdOrFail(tagId: number): Promise<TagEntity> {
    const tag = await this.tagRepository.findOneActiveById(tagId);
    if (!tag) {
      throw new NotFoundException(`Active tag with ID ${tagId} not found`);
    }
    return tag;
  }

  //? Verifica que el tagCode sea único
  private async ensureTagCodeIsUnique(tagCode: string, exceptTagId?: number): Promise<void> {
    const existing = await this.tagRepository.findOneByTagCode(tagCode);
    if (existing && existing.tagId !== exceptTagId) {
      throw new ConflictException(`Tag with code ${tagCode} already exists`);
    }
  }
}
