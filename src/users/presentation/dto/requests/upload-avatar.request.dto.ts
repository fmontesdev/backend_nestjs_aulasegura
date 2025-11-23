import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UploadAvatarRequest {
  @ApiProperty({
    description: 'Nombre del archivo que se guardará (debe incluir la extensión: .jpg, .jpeg, .png o .webp)',
    example: 'avatar_123.jpg',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/\.(jpg|jpeg|png|webp)$/i, {
    message: 'Filename must end with a valid image extension: .jpg, .jpeg, .png, or .webp',
  })
  filename: string;
}
