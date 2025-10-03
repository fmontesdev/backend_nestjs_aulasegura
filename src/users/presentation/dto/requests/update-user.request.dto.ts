import { IsEmail, IsOptional, IsString, IsDate, MaxLength, MinLength } from 'class-validator';

export class UpdateUserRequest {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastname?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar?: string | null;

  @IsOptional()
  @IsDate()
  validTo?: Date | null;
}
