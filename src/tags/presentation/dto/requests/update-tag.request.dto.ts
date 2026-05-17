import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class UpdateTagRequest {
  @ApiProperty({ 
    description: 'Nuevo UID leído de la credencial NFC física usado para regenerar la credencial type=rfid', 
    example: '04AABBCCDD22',
  })
  @IsString()
  @Matches(/^[0-9A-Fa-f]+$/, { message: 'rawUid must be a valid hexadecimal string' })
  rawUid!: string;
}
