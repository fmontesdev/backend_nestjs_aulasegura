import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes } from 'crypto';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
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

  /// Busca un tag por tagId o lanza una excepción si no se encuentra
  async findOne(tagId: number): Promise<TagEntity> {
    return await this.findTagByIdOrFail(tagId);
  }

  /// Busca un tag por tagCode o lanza una excepción si no se encuentra
  async findOneByTagCode(tagCode: string): Promise<TagEntity> {
    return await this.findTagByCodeOrFail(tagCode);
  }

  /// Crea un nuevo tag generando el tagCode según el tipo
  async create(createDto: CreateTagDto): Promise<TagEntity> {
    // Verificar que el usuario exista
    const user = await this.usersService.findOne(createDto.userId);

    // Validar rawUid si el tipo es RFID
    if (createDto.type === TagType.RFID) {
      if (!createDto.rawUid) {
        throw new BadRequestException('rawUid is required for RFID tags');
      }
    }

    // Generar tagCode según el tipo
    const tagCode = this.generateTagCode(createDto.type, createDto.rawUid);

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
      return await this.tagRepository.save(tag);
    } catch (error) {
      throw new ConflictException(`Tag could not be created`);
    }
  }

  /// Actualiza un tag existente y puede regenerar el tagCode
  async updateTagCode(tagId: number, updateDto: UpdateTagDto): Promise<TagEntity> {
    // Buscar el tag existente
    const tag = await this.findTagByIdOrFail(tagId);

    // Validar rawUid si el tipo es RFID
    if (tag.type === TagType.RFID && !updateDto.rawUid) {
      throw new BadRequestException('rawUid is required when changing to RFID type');
    }

    // Generar nuevo tagCode
    const newTagCode = this.generateTagCode(tag.type, updateDto.rawUid);
    await this.ensureTagCodeIsUnique(newTagCode);

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

  //? Genera tagCode según el tipo (RFID o NFC)
  private generateTagCode(type: TagType, rawUid?: string): string {
    const hmac = createHmac('sha256', this.pepper);
    let baseCode: Buffer | string;

    if (type === TagType.RFID) {
      if (!rawUid) {
        throw new BadRequestException('rawUid is required for RFID tag generation');
      }
      // RFID: tag_code = base64url( HMAC_SHA256(PEPPER, rawUid) )[0:16B] → ~22 chars
      baseCode = rawUid;
    } else {
      // randomBuffer: Genera 16 bytes aleatorios
      // NFC: tag_code = base64url( HMAC_SHA256(PEPPER, randomBuffer) )[0:16B] → ~22 char
      baseCode = randomBytes(16).toString('hex');
      console.log('Generated random buffer for NFC tag:', baseCode);
    }

    hmac.update(baseCode);
    const hash = hmac.digest();
    
    // Tomar primeros 16 bytes y convertir a base64url
    const base64url = hash.subarray(0, 16).toString('base64url');
    return base64url; // ~22 caracteres
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
  private async ensureTagCodeIsUnique(tagCode: string): Promise<void> {
    const existing = await this.tagRepository.findOneByTagCode(tagCode);
    if (existing) {
      throw new ConflictException(`Tag with code ${tagCode} already exists`);
    }
  }
}
