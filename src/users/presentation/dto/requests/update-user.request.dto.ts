import { IsEmail, IsOptional, IsString, IsDate, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRequest {
  @ApiPropertyOptional({ maxLength: 50, description: 'Nombre' })
  @IsOptional() @IsString() @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ maxLength: 100, description: 'Apellidos' })
  @IsOptional() @IsString() @MaxLength(100)
  lastname?: string;

  @ApiPropertyOptional({ maxLength: 100, format: 'email', description: 'Correo electrónico' })
  @IsOptional() @IsEmail() @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ minLength: 8, description: 'Contraseña en texto plano (se hashea en servidor)' })
  @IsOptional() @IsString() @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ maxLength: 255, nullable: true, description: 'URL del avatar o null' })
  @IsOptional() @IsString() @MaxLength(255)
  avatar?: string | null;

  @ApiPropertyOptional({
    description: 'Fecha final de validez en ISO 8601 o null',
    example: '2025-12-31T23:59:59.000Z',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @IsOptional() @IsDate()
  validTo?: Date | null;
}
