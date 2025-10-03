import { IsEmail, IsOptional, IsString, IsDate, MinLength, MaxLength, IsDateString } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  @MaxLength(50)
  name!: string;

  @IsString()
  @MaxLength(100)
  lastname!: string;

  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar?: string | null;

  @IsOptional()
  @IsDate()
  validTo?: Date | null;
}