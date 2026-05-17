import { ApiProperty } from '@nestjs/swagger';

class TeacherAssignmentTeacherResponse {
  @ApiProperty({ example: '6f9619ff-8b86-d011-b42d-00cf4fc964ff' })
  userId!: string;

  @ApiProperty({ example: 'Ana' })
  name!: string;

  @ApiProperty({ example: 'García' })
  lastname!: string;

  @ApiProperty({ example: 'ana.garcia@example.com' })
  email!: string;
}

class TeacherAssignmentCourseResponse {
  @ApiProperty({ example: 1 })
  courseId!: number;

  @ApiProperty({ example: 'ESO-1A' })
  courseCode!: string;

  @ApiProperty({ example: '1º ESO A' })
  name!: string;
}

class TeacherAssignmentSubjectResponse {
  @ApiProperty({ example: 1 })
  subjectId!: number;

  @ApiProperty({ example: 'MAT' })
  subjectCode!: string;

  @ApiProperty({ example: 'Matemáticas' })
  name!: string;
}

export class TeacherAssignmentResponse {
  @ApiProperty({ type: TeacherAssignmentTeacherResponse })
  teacher!: TeacherAssignmentTeacherResponse;

  @ApiProperty({ type: TeacherAssignmentCourseResponse })
  course!: TeacherAssignmentCourseResponse;

  @ApiProperty({ type: TeacherAssignmentSubjectResponse })
  subject!: TeacherAssignmentSubjectResponse;

  @ApiProperty({ example: '2026-05-17T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: true })
  isActive!: boolean;
}
