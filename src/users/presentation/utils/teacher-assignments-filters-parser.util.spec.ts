import { parseTeacherAssignmentsFiltersString } from './teacher-assignments-filters-parser.util';

describe('teacher assignments filters parser', () => {
  it('parses global search and field filters', () => {
    expect(parseTeacherAssignmentsFiltersString('garcia,teacherId:teacher-1,profesor:Ana,email:ana@example.com,curso:10,asignatura:20,estado:activo')).toEqual({
      globalSearch: ['garcia'],
      teacherId: 'teacher-1',
      teacher: 'Ana',
      email: 'ana@example.com',
      course: '10',
      courseId: 10,
      subject: '20',
      subjectId: 20,
      isActive: true,
    });
  });

  it('parses course and subject text without numeric ids', () => {
    expect(parseTeacherAssignmentsFiltersString('course:ESO-1A,subject:Matemáticas,active:false')).toEqual({
      course: 'ESO-1A',
      subject: 'Matemáticas',
      isActive: false,
    });
  });
});
