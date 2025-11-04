import { IsEmail, IsOptional, IsString, IsDate, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRequest {
  @ApiPropertyOptional({ maxLength: 50, description: 'Nombre del usuario' })
  @IsString()
  @MaxLength(50)
  @IsOptional() 
  name?: string;

  @ApiPropertyOptional({ maxLength: 100, description: 'Apellidos' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  lastname?: string;

  @ApiPropertyOptional({ maxLength: 100, format: 'email', description: 'Email del usuario' })
  @IsEmail()
  @MaxLength(100)
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ minLength: 8, description: 'Contraseña en texto plano (se hashea en servidor)' })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ maxLength: 255, nullable: true, description: 'Archivo de imagen del usuario, o null' })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  avatar?: string | null;

  @ApiPropertyOptional({
    description: 'Fecha final de validez en ISO 8601 o null',
    example: '2025-12-31T23:59:59.000Z',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @IsOptional()
  validTo?: Date | null;
}
