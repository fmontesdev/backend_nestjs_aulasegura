import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { AccessLogEntity } from '../../domain/entities/access-log.entity';
import { AccessLogRepository } from '../../domain/repositories/access-log.repository';
import { CreateAccessLogDto } from '../dto/create-access-log.dto';
import { RfidNfcAccessCheckDto } from '../dto/rfid-nfc-access-check.dto';
import { QrAccessCheckDto } from '../dto/qr-access-check.dto';
import { AccessStatus } from '../../domain/enums/access-status.enum';
import { AccessMethod } from '../../domain/enums/access-method.enum';
import { TagService } from 'src/tags/application/services/tag.service';
import { ReaderService } from 'src/readers/application/services/reader.service';
import { PermissionService } from '../../../permissions/application/services/permission.service';
import { PermissionEntity } from 'src/permissions/domain/entities/permission.entity';

@Injectable()
export class AccessService {
  private readonly pepper: string;

  constructor(
    private readonly accessLogRepository: AccessLogRepository,
    private readonly tagService: TagService,
    private readonly readerService: ReaderService,
    private readonly permissionService: PermissionService,
    private readonly configService: ConfigService,
  ) {
    this.pepper = this.configService.get<string>('TAG_PEPPER') || '';
    if (!this.pepper) {
      throw new Error('TAG_PEPPER environment variable is not defined');
    }
  }

  /// Busca todos los registros de acceso
  async findAll(): Promise<AccessLogEntity[]> {
    return await this.accessLogRepository.findAll();
  }

  /// Busca un registro de acceso por ID o lanza una excepción si no se encuentra
  async findOne(accessLogId: number): Promise<AccessLogEntity> {
    return await this.findAccessLogByIdOrFail(accessLogId);
  }

  /// Crea un nuevo registro de acceso
  async create(createDto: CreateAccessLogDto): Promise<AccessLogEntity> {
    const accessLog = new AccessLogEntity();
    accessLog.tagId = createDto.tagId ?? null;
    accessLog.userId = createDto.userId;
    accessLog.readerId = createDto.readerId;
    accessLog.roomId = createDto.roomId;
    accessLog.subjectId = createDto.subjectId ?? null;
    accessLog.accessMethod = createDto.accessMethod;
    accessLog.accessStatus = createDto.accessStatus;

    return await this.accessLogRepository.save(accessLog);
  }

  /// Verifica el acceso de un usuario a un aula y registra el intento a través de RFID/NFC
  async rfidNfcAccessCheck(checkDto: RfidNfcAccessCheckDto, currentUser: any): Promise<[PermissionEntity | null, AccessStatus, string]> {
    let tagId: number;
    let tagCode: string;
    let userId: string;
    let readerId: number;
    let roomId: number;
    let permission: PermissionEntity | null;
    let accessStatus: AccessStatus = AccessStatus.DENIED;
    let reasonStatus: string | null = null;

    try {
      //* Obtiene tagCode según el método de acceso
      if (checkDto.accessMethod === AccessMethod.RFID || checkDto.accessMethod === AccessMethod.NFC) {
        if (!checkDto.rawUid) {
          throw new BadRequestException('rawUid is required for RFID/NFC access method');
        }
        // Calcula HMAC con PEPPER sobre raw_uid
        tagCode = this.calculateTagCodeFromRawUid(checkDto.rawUid);
      } else {
        throw new BadRequestException('Unsupported access method');
      }

      //* Busca tag activo por tagCode
      const tag = await this.tagService.findOneByTagCode(tagCode);
      if (!tag) {
        reasonStatus = 'Tag not found';
        throw new NotFoundException(reasonStatus);
      }

      if (!tag.isActive) {
        reasonStatus = 'Inactive tag';
        throw new BadRequestException(reasonStatus);
      }

      tagId = tag.tagId;
      userId = tag.userId;

      //* Si se accede por NFC, verifica que el userId del tag coincida con el userId del currentUser
      if (checkDto.accessMethod === AccessMethod.NFC && userId !== currentUser.userId) {
        reasonStatus = 'The NFC does not belong to the authenticated user';
        throw new BadRequestException(reasonStatus);
      }

      //* Busca reader activo por readerCode
      const reader = await this.readerService.findOneByReaderCode(checkDto.readerCode);
      if (!reader) {
        reasonStatus = 'Reader not found';
        throw new NotFoundException(reasonStatus);
      }

      if (!reader.isActive) {
        reasonStatus = 'Inactive reader';
        throw new BadRequestException(reasonStatus);
      }

      readerId = reader.readerId;
      roomId = reader.roomId;

      //* Valida si el usuario tiene permiso activo en este momento para esta aula
      permission = await this.permissionService.activePermissionAtCurrentTime(userId, roomId);

      if (permission !== null) {
        accessStatus = AccessStatus.ALLOWED;
        reasonStatus = 'Valid permission found';
      } else {
        accessStatus = AccessStatus.DENIED;
        reasonStatus = 'No valid permission found';
      }
    } catch (error) {
      accessStatus = AccessStatus.DENIED;
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        reasonStatus = reasonStatus || error.message;
      } else {
        reasonStatus = 'Internal error while validating access';
      }
    }

    //* Registra el intento de acceso en AccessLog
    if (tagId! && userId! && readerId! && roomId!) {
      await this.create({
        tagId,
        userId,
        readerId,
        roomId,
        subjectId: null,
        accessMethod: checkDto.accessMethod,
        accessStatus,
      });
    }

    //* Retorna respuesta
    return [permission!, accessStatus, reasonStatus];
  }

  /// Verifica el acceso de un usuario a un aula y registra el intento solo a través de QR
  async qrAccessCheck(checkDto: QrAccessCheckDto, currentUser: any): Promise<[PermissionEntity | null, AccessStatus, string]> {
    let userId: string;
    let readerId: number;
    let roomId: number;
    let permission: PermissionEntity | null;
    let accessStatus: AccessStatus = AccessStatus.DENIED;
    let reasonStatus: string | null = null;

    try {
      //* Usuario autenticado
      userId = currentUser.userId;

      //* Busca reader activo por readerCode
      const reader = await this.readerService.findOneByReaderCode(checkDto.readerCode);
      if (!reader) {
        reasonStatus = 'Reader not found';
        throw new NotFoundException(reasonStatus);
      }

      if (!reader.isActive) {
        reasonStatus = 'Inactive reader';
        throw new BadRequestException(reasonStatus);
      }

      readerId = reader.readerId;
      roomId = reader.roomId;

      //* Valida si el usuario tiene permiso activo en este momento para esta aula
      permission = await this.permissionService.activePermissionAtCurrentTime(userId, roomId);

      if (permission !== null) {
        accessStatus = AccessStatus.ALLOWED;
        reasonStatus = 'Valid permission found';
      } else {
        accessStatus = AccessStatus.DENIED;
        reasonStatus = 'No valid permission found';
      }
    } catch (error) {
      accessStatus = AccessStatus.DENIED;
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        reasonStatus = reasonStatus || error.message;
      } else {
        reasonStatus = 'Internal error while validating access';
      }
    }

    //* Registra el intento de acceso en AccessLog
    if (userId! && readerId! && roomId!) {
      await this.create({
        tagId: null,
        userId,
        readerId,
        roomId,
        subjectId: null,
        accessMethod: checkDto.accessMethod,
        accessStatus,
      });
    }

    //* Retorna respuesta
    return [permission!, accessStatus, reasonStatus];
  }

  //? ================= Métodos auxiliares =================

  //? Calcula el tagCode a partir de raw_uid usando HMAC-SHA256
  private calculateTagCodeFromRawUid(rawUid: string): string {
    const hmac = createHmac('sha256', this.pepper);
    hmac.update(rawUid);
    const hash = hmac.digest();
    const base64url = hash.subarray(0, 16).toString('base64url');
    return base64url;
  }

  //? Busca un registro de acceso por ID o lanza una excepción si no se encuentra
  private async findAccessLogByIdOrFail(accessLogId: number): Promise<AccessLogEntity> {
    const accessLog = await this.accessLogRepository.findOneById(accessLogId);
    if (!accessLog) {
      throw new NotFoundException(`Access log with ID ${accessLogId} not found`);
    }
    return accessLog;
  }
}
