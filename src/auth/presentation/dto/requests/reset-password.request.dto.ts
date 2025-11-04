import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequest {
  @ApiProperty({ 
    description: 'Email del usuario',
    example: 'usuario@example.com' 
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email!: string;

  @ApiProperty({ 
    description: 'Código de recuperación de 6 caracteres',
    example: 'A3F9K2',
    minLength: 6,
    maxLength: 6
  })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @Matches(/^[A-Z0-9]{6}$/, { message: 'El código debe ser de 6 caracteres alfanuméricos. Solo admite letras mayúsculas y números' })
  resetToken!: string;

  @ApiProperty({ 
    description: 'Nueva contraseña',
    example: 'NuevaContraseña123!',
    minLength: 8
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'La contraseña debe contener al menos una letra y un número',
  })
  newPassword!: string;
}
