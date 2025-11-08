import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateDepartmentRequest {
  @ApiProperty({ description: 'Nombre del departamento', example: 'Matemáticas', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Department name must not exceed 50 characters' })
  name!: string;
}
