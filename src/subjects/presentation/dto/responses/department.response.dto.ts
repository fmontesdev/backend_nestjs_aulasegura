import { ApiProperty } from '@nestjs/swagger';

export class DepartmentResponse {
  @ApiProperty({ description: 'Identificador único del departamento', example: 1 })
  departmentId: number;

  @ApiProperty({ description: 'Nombre del departamento', example: 'Matemáticas' })
  name: string;
}
