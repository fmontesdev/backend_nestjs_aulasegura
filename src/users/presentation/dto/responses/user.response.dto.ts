import { IsEmail, IsOptional, IsString, IsDate, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'Identificador del usuario (UUID v4)',
    format: 'uuid',
    example: '00000000-0000-0000-0000-000000000000',
  })
  userId!: string;

  @ApiProperty({ maxLength: 50, description: 'Nombre' })
  @IsString() @MaxLength(50)
  name!: string;

  @ApiProperty({ maxLength: 100, description: 'Apellidos' })
  @IsString() @MaxLength(100)
  lastname!: string;

  @ApiProperty({ maxLength: 100, format: 'email', description: 'Correo electrónico' })
  @IsEmail() @MaxLength(100)
  email!: string;

  @ApiPropertyOptional({ maxLength: 255, nullable: true, description: 'URL del avatar o null' })
  @IsOptional() @IsString() @MaxLength(255)
  avatar!: string | null;

  @ApiProperty({
    description: 'Fecha de inicio de validez en ISO 8601',
    example: '2025-12-31T23:59:59.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  validFrom!: Date;

  @ApiPropertyOptional({
    description: 'Fecha final de validez en ISO 8601 o null',
    example: '2025-12-31T23:59:59.000Z',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @IsOptional() @IsDate()
  validTo!: Date | null;

  @ApiProperty({
    description: 'Fecha de creación en ISO 8601',
    example: '2025-12-31T23:59:59.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  createdAt!: Date;
}
