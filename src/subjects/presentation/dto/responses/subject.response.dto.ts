import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponse } from '../../../../departments/presentation/dto/responses/department.response.dto';
import { CourseResponse } from '../../../../courses/presentation/dto/responses/course.response.dto';

export class SubjectResponse {
  @ApiProperty({ description: 'Identificador único de la asignatura', example: 1 })
  subjectId: number;

  @ApiProperty({ description: 'Código único de la asignatura', example: 'MATH-ALG' })
  subjectCode: string;

  @ApiProperty({ description: 'Nombre de la asignatura', example: 'Álgebra Lineal' })
  name: string;

  @ApiProperty({ description: 'Estado de la asignatura (eliminación lógica)', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Departamento al que pertenece la asignatura', type: DepartmentResponse })
  department?: DepartmentResponse;

  @ApiProperty({ description: 'Cursos asociados a la asignatura', type: [CourseResponse] })
  courses: CourseResponse[] | [];
}
