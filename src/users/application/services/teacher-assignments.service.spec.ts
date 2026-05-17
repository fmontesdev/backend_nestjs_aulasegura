import { ConflictException } from '@nestjs/common';
import { CourseEntity } from '../../../courses/domain/entities/course.entity';
import { SubjectEntity } from '../../../subjects/domain/entities/subject.entity';
import { TeacherEntity } from '../../domain/entities/teacher.entity';
import { TeacherSubjectCourseEntity } from '../../domain/entities/teacher-subject-course.entity';
import { TeacherAssignmentsRepository } from '../../domain/repositories/teacher-assignments.repository';
import { TeacherAssignmentsService } from './teacher-assignments.service';

describe('TeacherAssignmentsService', () => {
  let service: TeacherAssignmentsService;
  let repository: jest.Mocked<TeacherAssignmentsRepository>;

  const teacher = {
    userId: 'teacher-1',
    user: {
      userId: 'teacher-1',
      name: 'Ana',
      lastname: 'García',
      email: 'ana@example.com',
    },
  } as TeacherEntity;

  const course = {
    courseId: 10,
    courseCode: 'ESO-1A',
    name: '1º ESO A',
  } as CourseEntity;

  const subject = {
    subjectId: 20,
    subjectCode: 'MAT',
    name: 'Matemáticas',
  } as SubjectEntity;

  const assignment = {
    assignmentId: 1,
    userId: teacher.userId,
    teacher,
    courseId: course.courseId,
    course,
    subjectId: subject.subjectId,
    subject,
    createdAt: new Date('2026-05-17T12:00:00.000Z'),
    isActive: true,
  } as TeacherSubjectCourseEntity;

  beforeEach(() => {
    repository = {
      findTeacherByUserId: jest.fn().mockResolvedValue(teacher),
      findCourseById: jest.fn().mockResolvedValue(course),
      findSubjectById: jest.fn().mockResolvedValue(subject),
      existsCourseSubject: jest.fn().mockResolvedValue(true),
      findAllWithFilters: jest.fn().mockResolvedValue({ data: [assignment], total: 1, page: 1, limit: 10, totalPages: 1 }),
      findByTeacherId: jest.fn().mockResolvedValue([assignment]),
      findByAssignmentId: jest.fn().mockResolvedValue(assignment),
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue(assignment),
      softDeleteByAssignmentId: jest.fn().mockResolvedValue(undefined),
    };

    service = new TeacherAssignmentsService(repository);
  });

  it('returns paginated assignments with response mapping', async () => {
    const result = await service.findAllWithFilters({ page: 1, limit: 10, teacherId: teacher.userId, teacher: 'Ana' });

    expect(repository.findAllWithFilters).toHaveBeenCalledWith({ page: 1, limit: 10, teacherId: teacher.userId, teacher: 'Ana' });
    expect(result).toEqual({
      data: [{
        assignmentId: assignment.assignmentId,
        teacher: {
          userId: teacher.userId,
          name: teacher.user.name,
          lastname: teacher.user.lastname,
          email: teacher.user.email,
        },
        course: {
          courseId: course.courseId,
          courseCode: course.courseCode,
          name: course.name,
        },
        subject: {
          subjectId: subject.subjectId,
          subjectCode: subject.subjectCode,
          name: subject.name,
        },
        createdAt: assignment.createdAt,
        isActive: true,
      }],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it('creates assignment when teacher, course, subject and course_subject exist', async () => {
    const result = await service.create({ teacherId: teacher.userId, courseId: course.courseId, subjectId: subject.subjectId });

    expect(repository.findTeacherByUserId).toHaveBeenCalledWith(teacher.userId);
    expect(repository.findCourseById).toHaveBeenCalledWith(course.courseId);
    expect(repository.findSubjectById).toHaveBeenCalledWith(subject.subjectId);
    expect(repository.existsCourseSubject).toHaveBeenCalledWith(course.courseId, subject.subjectId);
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
      userId: teacher.userId,
      courseId: course.courseId,
      subjectId: subject.subjectId,
      isActive: true,
    }));
    expect(result).toEqual({
      assignmentId: assignment.assignmentId,
      teacher: {
        userId: teacher.userId,
        name: teacher.user.name,
        lastname: teacher.user.lastname,
        email: teacher.user.email,
      },
      course: {
        courseId: course.courseId,
        courseCode: course.courseCode,
        name: course.name,
      },
      subject: {
        subjectId: subject.subjectId,
        subjectCode: subject.subjectCode,
        name: subject.name,
      },
      createdAt: assignment.createdAt,
      isActive: true,
    });
  });

  it('rejects duplicate assignment', async () => {
    repository.findOne.mockResolvedValue(assignment);

    await expect(service.create({ teacherId: teacher.userId, courseId: course.courseId, subjectId: subject.subjectId }))
      .rejects
      .toThrow(ConflictException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('reactivates existing inactive assignment instead of rejecting it', async () => {
    const inactiveAssignment = { ...assignment, isActive: false } as TeacherSubjectCourseEntity;
    const reactivatedAssignment = { ...assignment, isActive: true } as TeacherSubjectCourseEntity;
    repository.findOne.mockResolvedValue(inactiveAssignment);
    repository.save.mockResolvedValue(reactivatedAssignment);

    const result = await service.create({ teacherId: teacher.userId, courseId: course.courseId, subjectId: subject.subjectId });

    expect(inactiveAssignment.isActive).toBe(true);
    expect(repository.save).toHaveBeenCalledWith(inactiveAssignment);
    expect(result.isActive).toBe(true);
    expect(result.assignmentId).toBe(assignment.assignmentId);
  });

  it('rejects subject not in course', async () => {
    repository.existsCourseSubject.mockResolvedValue(false);

    await expect(service.create({ teacherId: teacher.userId, courseId: course.courseId, subjectId: subject.subjectId }))
      .rejects
      .toThrow(ConflictException);
    expect(repository.findOne).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('soft deletes assignment by stable assignmentId', async () => {
    await service.deleteByAssignmentId(assignment.assignmentId);

    expect(repository.findByAssignmentId).toHaveBeenCalledWith(assignment.assignmentId);
    expect(repository.softDeleteByAssignmentId).toHaveBeenCalledWith(assignment.assignmentId);
  });
});
