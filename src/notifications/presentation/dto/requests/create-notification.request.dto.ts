import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateIf, ValidateNested } from 'class-validator';
import { RoleName } from '../../../../users/domain/enums/rolename.enum';
import { NotificationTargetMode } from '../../../application/dto/create-manual-notification.dto';
import { NotificationType } from '../../../domain/entities/notification.entity';

export class NotificationTargetRequest {
  @ApiProperty({ enum: NotificationTargetMode, example: NotificationTargetMode.ROLE })
  @IsEnum(NotificationTargetMode)
  mode!: NotificationTargetMode;

  @ApiProperty({ required: false, example: '0f0b2aa1-7f78-41e6-a46f-1f6e9a6d63f8' })
  @ValidateIf((target) => target.mode === NotificationTargetMode.USER)
  @IsUUID()
  @IsNotEmpty()
  userId?: string;

  @ApiProperty({ required: false, enum: RoleName, example: RoleName.TEACHER })
  @Transform(({ obj, key, value }) => {
    const rawValue = obj[key];
    return typeof rawValue === 'string' ? rawValue.toLowerCase() : value;
  })
  @ValidateIf((target) => target.mode === NotificationTargetMode.ROLE)
  @IsEnum(RoleName)
  @IsNotEmpty()
  roleName?: RoleName;
}

export class CreateNotificationRequest {
  @ApiProperty({ enum: NotificationType, example: NotificationType.WARNING })
  @IsEnum(NotificationType)
  type!: NotificationType;

  @ApiProperty({ example: 'Mantenimiento programado', maxLength: 100 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @ApiProperty({ example: 'El sistema no estará disponible a partir de las 18:00.', maxLength: 255 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  body!: string;

  @ApiProperty({ type: NotificationTargetRequest })
  @ValidateNested()
  @Type(() => NotificationTargetRequest)
  target!: NotificationTargetRequest;
}
