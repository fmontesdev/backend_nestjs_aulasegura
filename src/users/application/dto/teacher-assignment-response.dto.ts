export interface TeacherAssignmentResponseDto {
  teacher: {
    userId: string;
    name: string;
    lastname: string;
    email: string;
  };
  course: {
    courseId: number;
    courseCode: string;
    name: string;
  };
  subject: {
    subjectId: number;
    subjectCode: string;
    name: string;
  };
  createdAt: Date;
  isActive: boolean;
}
