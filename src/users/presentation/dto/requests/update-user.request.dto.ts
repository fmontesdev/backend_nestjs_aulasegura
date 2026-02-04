import { IsEmail, IsOptional, IsString, IsDate, MaxLength, MinLength, IsEnum, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoleName } from '../../../domain/enums/rolename.enum';

export class UpdateUserRequest {
  @ApiPropertyOptional({ maxLength: 50, description: 'Nombre del usuario' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  @IsOptional() 
  name?: string;

  @ApiPropertyOptional({ maxLength: 100, description: 'Apellidos' })
  @IsString({ message: 'Lastname must be a string' })
  @MaxLength(100, { message: 'Lastname cannot exceed 100 characters' })
  @IsOptional()
  lastname?: string;

  @ApiPropertyOptional({ maxLength: 100, format: 'email', description: 'Email del usuario' })
  @IsEmail({}, { message: 'Invalid email' })
  @MaxLength(100, { message: 'Email cannot exceed 100 characters' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ minLength: 8, description: 'Contraseña en texto plano (se hashea en servidor)' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ maxLength: 255, nullable: true, description: 'Archivo de imagen del usuario, o null' })
  @IsString({ message: 'Avatar must be a string' })
  @MaxLength(255, { message: 'Avatar cannot exceed 255 characters' })
  @IsOptional()
  avatar?: string | null;

  @ApiPropertyOptional({
    description: 'Roles del usuario',
    enum: RoleName,
    isArray: true,
    example: [RoleName.TEACHER, RoleName.ADMIN],
  })
  @IsArray({ message: 'RoleNames must be an array' })
  @IsEnum(RoleName, { each: true, message: 'Each role must be a valid RoleName' })
  @IsOptional()
  roles?: RoleName[];

  @ApiPropertyOptional({
    description: 'Fecha final de validez en ISO 8601 o null',
    example: '2025-12-31T23:59:59.000Z',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate({ message: 'ValidTo must be a valid date' })
  @IsOptional()
  validTo?: Date | null;

  @ApiPropertyOptional({ 
    type: 'integer',
    description: 'ID del departamento (solo para usuarios con rol teacher)'
  })
  @IsInt({ message: 'Department ID must be an integer' })
  @IsOptional()
  departmentId?: number;
}
