import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsEnum, IsInt, Matches, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { RoleName } from '../../../../users/domain/enums/rolename.enum';

export class RegisterRequest {
  @ApiProperty({ maxLength: 50, description: 'Nombre del usuario' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @ApiProperty({ maxLength: 100, description: 'Apellidos del usuario' })
  @IsString({ message: 'Lastname must be a string' })
  @MaxLength(100, { message: 'Lastname cannot exceed 100 characters' })
  @IsNotEmpty({ message: 'Lastname is required' })
  lastname!: string;

  @ApiProperty({ format: 'email', maxLength: 100, description: 'Email del usuario' })
  @IsEmail({}, { message: 'Invalid email' })
  @MaxLength(100, { message: 'Email cannot exceed 100 characters' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ minLength: 8, description: 'Contraseña en texto plano (se hashea en servidor)' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'The password must contain at least one letter and one number',
  })
  password!: string;

  @ApiPropertyOptional({ maxLength: 255, description: 'Archivo de imagen del usuario, o null' })
  @IsString({ message: 'Avatar must be a string' })
  @MaxLength(255, { message: 'Avatar cannot exceed 255 characters' })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ 
    enum: RoleName,
    isArray: true,
    description: 'Roles del usuario',
    example: [RoleName.TEACHER]
  })
  @IsArray({ message: 'RoleNames must be an array' })
  @IsEnum(RoleName, { each: true, message: `Each role must be one of: ${Object.values(RoleName).join(', ')}` })
  @IsNotEmpty({ message: 'At least one role is required' })
  roles!: RoleName[];

  @ApiPropertyOptional({ 
    type: 'integer',
    description: 'ID del departamento (obligatorio si el rol es teacher)' 
  })
  @IsInt({ message: 'Department ID must be an integer' })
  @IsOptional()
  departmentId?: number;

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
}
