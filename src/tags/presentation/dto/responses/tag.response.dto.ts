import { ApiProperty } from '@nestjs/swagger';
import { TagType } from '../../../domain/enums/tag-type.enum';
import { UserResponse } from '../../../../users/presentation/dto/responses/user.response.dto';

export class TagResponse {
  @ApiProperty({ description: 'Identificador único del tag', example: 1 })
  tagId: number;

  @ApiProperty({ description: 'Código generado del tag', example: 'AbCdEfGhIjKlMnOpQrSt' })
  tagCode: string;

  @ApiProperty({ description: 'Tipo de tag', enum: TagType, example: TagType.RFID })
  type: TagType;

  @ApiProperty({ description: 'Fecha de emisión del tag', example: '2024-01-15T10:30:00.000Z' })
  issuedAt: Date;

  @ApiProperty({ description: 'Estado del tag (eliminación lógica)', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Usuario propietario del tag', type: UserResponse })
  user: UserResponse;
}
