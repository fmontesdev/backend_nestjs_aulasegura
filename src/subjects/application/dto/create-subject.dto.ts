export interface CreateSubjectDto {
  subjectCode: string;
  name: string;
  departmentId: number;
  courseIds: number[];
}
