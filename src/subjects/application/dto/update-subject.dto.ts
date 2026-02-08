export interface UpdateSubjectDto {
  subjectCode?: string;
  name?: string;
  departmentId?: number;
  courseIds?: number[];
  isActive?: boolean;
}
