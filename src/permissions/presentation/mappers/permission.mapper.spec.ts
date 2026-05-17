import { PermissionMapper } from './permission.mapper';
import { PermissionEntity } from '../../domain/entities/permission.entity';
import { ScheduleType } from '../../../schedules/domain/enums/schedule-type.enum';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

describe('PermissionMapper', () => {
  it('includes enriched assignment in PermissionResponse', () => {
    const permission = Object.assign(new PermissionEntity(), {
      user: {
        userId: '00000000-0000-0000-0000-000000000001',
        name: 'Teacher',
        lastname: 'One',
        email: 'teacher@example.com',
        avatar: null,
        roles: [{ name: RoleName.TEACHER }],
        validFrom: new Date('2024-01-01T00:00:00Z'),
        validTo: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
      },
      room: { roomId: 1, roomCode: 'A1', name: 'Aula 1', courseId: null, capacity: 30, building: 'A', floor: 1 },
      schedule: {
        scheduleId: 1,
        type: ScheduleType.WEEKLY,
        academicYear: { academicYearId: 1, code: '2025-2026', isActive: true },
        isActive: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: null,
        weeklySchedule: { dayOfWeek: 1, startTime: '08:00:00', endTime: '09:00:00', validFrom: '2024-09-01', validTo: null },
      },
      assignment: {
        assignmentId: 10,
        isActive: true,
        teacher: { userId: '00000000-0000-0000-0000-000000000001', user: { name: 'Teacher', lastname: 'One', email: 'teacher@example.com' } },
        course: { courseId: 1, courseCode: '1ESO-A', name: '1º ESO A' },
        subject: { subjectId: 1, subjectCode: 'MAT', name: 'Matemáticas' },
      },
      createdById: '00000000-0000-0000-0000-000000000002',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      isActive: true,
    });

    const result = PermissionMapper.toResponse(permission);

    expect(result.assignment).toEqual({
      assignmentId: 10,
      teacher: {
        userId: '00000000-0000-0000-0000-000000000001',
        name: 'Teacher',
        lastname: 'One',
        email: 'teacher@example.com',
      },
      course: { courseId: 1, courseCode: '1ESO-A', name: '1º ESO A' },
      subject: { subjectId: 1, subjectCode: 'MAT', name: 'Matemáticas' },
      isActive: true,
    });
  });
});
