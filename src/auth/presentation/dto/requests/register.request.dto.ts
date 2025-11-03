import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsEnum, IsInt } from 'class-validator';
import { RoleName } from '../../../../users/domain/enums/rolename.enum';

export class RegisterRequest {
  @ApiProperty({ maxLength: 50, description: 'Nombre del usuario' })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ maxLength: 100, description: 'Apellidos del usuario' })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  lastname!: string;

  @ApiProperty({ format: 'email', maxLength: 100, description: 'Email del usuario' })
  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ minLength: 8, description: 'Contraseña en texto plano (se hashea en servidor)' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({ maxLength: 255, description: 'Archivo de imagen del usuario, o null' })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  avatar?: string;

  @ApiProperty({ 
    enum: RoleName, 
    description: 'Rol del usuario',
    example: RoleName.TEACHER
  })
  @IsEnum(RoleName)
  roleName!: RoleName;

  @ApiPropertyOptional({ 
    type: 'integer',
    description: 'ID del departamento (obligatorio si el rol es teacher)' 
  })
  @IsInt()
  @IsOptional()
  departmentId?: number;
}
