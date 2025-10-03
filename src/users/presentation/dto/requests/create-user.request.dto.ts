import { IsEmail, IsOptional, IsString, IsDate, MinLength, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserRequest {
  @ApiProperty({ maxLength: 50, description: 'Nombre' })
  @IsString() @MaxLength(50)
  name!: string;

  @ApiProperty({ maxLength: 100, description: 'Apellidos' })
  @IsString() @MaxLength(100)
  lastname!: string;

  @ApiProperty({ format: 'email', maxLength: 100, description: 'Correo electrónico' })
  @IsEmail() @MaxLength(100)
  email!: string;

  @ApiProperty({ minLength: 8, description: 'Contraseña en texto plano (se hashea en servidor)' })
  @IsString() @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

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