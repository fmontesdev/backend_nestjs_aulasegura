import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequest {
  @ApiProperty({ description: 'Refresh token para obtener un nuevo access token' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
