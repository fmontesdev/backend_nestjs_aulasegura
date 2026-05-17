import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class DeleteTeacherAssignmentRequest {
  @ApiProperty({ description: 'ID del profesor (userId)', example: '7b0d8f4c-1c2b-4d7f-8a9b-1c2d3e4f5a6b' })
  @IsString()
  teacherId!: string;

  @ApiProperty({ description: 'ID del curso', example: 1 })
  @IsInt()
  courseId!: number;

  @ApiProperty({ description: 'ID de la asignatura', example: 1 })
  @IsInt()
  subjectId!: number;
}
