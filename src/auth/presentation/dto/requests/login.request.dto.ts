import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequest {
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
}
