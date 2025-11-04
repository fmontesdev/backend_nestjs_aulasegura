import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ format: 'email', maxLength: 100, description: 'Email del usuario' })
  @IsEmail({}, { message: 'Invalid email' })
  @MaxLength(100, { message: 'Email cannot exceed 100 characters' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ minLength: 8, description: 'Contraseña en texto plano (se hashea en servidor)' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
