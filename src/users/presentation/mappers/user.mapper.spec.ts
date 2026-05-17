import { UserEntity } from '../../domain/entities/user.entity';
import { RoleName } from '../../domain/enums/rolename.enum';
import { UserMapper } from './user.mapper';

describe('UserMapper', () => {
  const createUser = (overrides: Partial<UserEntity>): UserEntity => ({
    userId: 'user-1',
    name: 'Ada',
    lastname: 'Lovelace',
    email: 'ada@example.com',
    passwordHash: 'hash',
    avatar: null,
    validFrom: new Date('2026-01-01T00:00:00.000Z'),
    validTo: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    tokenVersion: 1,
    roles: [],
    ...overrides,
  } as UserEntity);

  it('maps non-teacher courses as null', () => {
    const user = createUser({ roles: [{ name: RoleName.ADMIN }] as any });

    expect(UserMapper.toResponse(user).courses).toBeNull();
  });

  it('maps teacher with no active assignments to empty courses', () => {
    const user = createUser({
      roles: [{ name: RoleName.TEACHER }] as any,
      teacher: { department: { departmentId: 1, name: 'Ciencias' }, subjectCourseAssignments: [] } as any,
    });

    expect(UserMapper.toResponse(user).courses).toEqual([]);
  });

  it('groups multiple assignments for the same course with multiple subjects', () => {
    const user = createUser({
      roles: [{ name: RoleName.TEACHER }] as any,
      teacher: {
        department: { departmentId: 1, name: 'Ciencias' },
        subjectCourseAssignments: [
          {
            isActive: true,
            course: { courseId: 1, courseCode: '1ESO', name: '1º ESO' },
            subject: { subjectId: 10, subjectCode: 'MAT', name: 'Matemáticas' },
          },
          {
            isActive: true,
            course: { courseId: 1, courseCode: '1ESO', name: '1º ESO' },
            subject: { subjectId: 11, subjectCode: 'FIS', name: 'Física' },
          },
        ],
      } as any,
    });

    expect(UserMapper.toResponse(user).courses).toEqual([
      {
        courseId: 1,
        courseCode: '1ESO',
        name: '1º ESO',
        subjects: [
          { subjectId: 10, subjectCode: 'MAT', name: 'Matemáticas' },
          { subjectId: 11, subjectCode: 'FIS', name: 'Física' },
        ],
      },
    ]);
  });

  it('excludes inactive assignments defensively', () => {
    const user = createUser({
      roles: [{ name: RoleName.TEACHER }] as any,
      teacher: {
        subjectCourseAssignments: [
          {
            isActive: false,
            course: { courseId: 1, courseCode: '1ESO', name: '1º ESO' },
            subject: { subjectId: 10, subjectCode: 'MAT', name: 'Matemáticas' },
          },
        ],
      } as any,
    });

    expect(UserMapper.toResponse(user).courses).toEqual([]);
  });
});
