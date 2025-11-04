import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequest {
  @ApiProperty({ 
    description: 'Email del usuario',
    example: 'usuario@example.com' 
  })
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ 
    description: 'Código de recuperación de 6 caracteres',
    example: 'A3F9K2',
    minLength: 6,
    maxLength: 6
  })
  @IsString({ message: 'The code must be a text string' })
  @IsNotEmpty({ message: 'The code is required' })
  @Matches(/^[A-Z0-9]{6}$/, { message: 'The code must be 6 alphanumeric characters long and can only contain uppercase letters and numbers' })
  resetToken!: string;

  @ApiProperty({ 
    description: 'Nueva contraseña',
    example: 'ABcd1234',
    minLength: 8
  })
  @IsString({ message: 'The password must be a text string' })
  @IsNotEmpty({ message: 'The password is required' })
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'The password must contain at least one letter and one number',
  })
  newPassword!: string;
}
