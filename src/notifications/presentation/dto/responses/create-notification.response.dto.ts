import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationResponseDto {
  @ApiProperty({ example: '123' })
  notificationId!: string;

  @ApiProperty({ example: 12 })
  createdRecipients!: number;
}
