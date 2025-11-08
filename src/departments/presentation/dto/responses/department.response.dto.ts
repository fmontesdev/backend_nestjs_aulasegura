import { ApiProperty } from '@nestjs/swagger';
import { SubjectResponse } from '../../../../subjects/presentation/dto/responses/subject.response.dto';
import { UserResponse } from '../../../../users/presentation/dto/responses/user.response.dto';

export class DepartmentResponse {
  @ApiProperty({ description: 'Identificador único del departamento', example: 1 })
  departmentId: number;

  @ApiProperty({ description: 'Nombre del departamento', example: 'Matemáticas' })
  name: string;

  @ApiProperty({ description: 'Estado del departamento (eliminación lógica)', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Asignaturas asociadas al departamento', type: [SubjectResponse] })
  subjects?: SubjectResponse[] | [];

  @ApiProperty({ description: 'Profesores asociados al departamento', type: [UserResponse] })
  teachers?: UserResponse[] | [];
}
