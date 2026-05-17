import { BadRequestException } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionRepository } from '../../domain/repositories/permission.repository';
import { PermissionEntity } from '../../domain/entities/permission.entity';
import { ScheduleType } from '../../../schedules/domain/enums/schedule-type.enum';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

describe('PermissionService weekly teacher assignments', () => {
  const adminId = '00000000-0000-0000-0000-000000000001';
  const teacherId = '00000000-0000-0000-0000-000000000002';
  const otherTeacherId = '00000000-0000-0000-0000-000000000003';
  const janitorId = '00000000-0000-0000-0000-000000000004';

  let service: PermissionService;
  let permissionRepository: jest.Mocked<PermissionRepository>;
  let usersService: any;
  let roomService: any;
  let scheduleService: any;
  let teacherAssignmentsService: any;

  const weeklySchedule = { scheduleId: 1, type: ScheduleType.WEEKLY, isActive: true };
  const eventSchedule = { scheduleId: 2, type: ScheduleType.EVENT, isActive: true };
  const room = { roomId: 1, name: 'Aula 1' };
  const teacher = { userId: teacherId, roles: [{ name: RoleName.TEACHER }], name: 'Teacher' };
  const otherTeacher = { userId: otherTeacherId, roles: [{ name: RoleName.TEACHER }], name: 'Other' };
  const janitor = { userId: janitorId, roles: [{ name: RoleName.JANITOR }], name: 'Janitor' };

  const activeAssignment = {
    assignmentId: 10,
    userId: teacherId,
    isActive: true,
    teacher: { userId: teacherId, user: { userId: teacherId, name: 'Teacher', lastname: 'One', email: 'teacher@example.com' } },
    course: { courseId: 1, courseCode: '1ESO-A', name: '1º ESO A' },
    subject: { subjectId: 1, subjectCode: 'MAT', name: 'Matemáticas' },
  };

  beforeEach(() => {
    permissionRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findActiveWeeklySchedulesForUser: jest.fn(),
      findActiveReservationsForUser: jest.fn(),
      findWeeklySchedulePermissionOverlappingForRoom: jest.fn().mockResolvedValue([]),
      findWeeklyScheduleOverlappingForRoom: jest.fn(),
      findEventScheduleOverlappingForRoom: jest.fn(),
      findActiveWeeklyPermissionForUserAtCurrentTime: jest.fn(),
      findActiveEventPermissionForUserAtCurrentTime: jest.fn(),
      findOccupiedRooms: jest.fn(),
      save: jest.fn(async (permission: PermissionEntity) => permission),
      updatePrimaryKeys: jest.fn(),
      hardRemove: jest.fn(),
    };
    usersService = { findOne: jest.fn() };
    roomService = { findOne: jest.fn().mockResolvedValue(room) };
    scheduleService = { findOne: jest.fn().mockResolvedValue(weeklySchedule), hardRemove: jest.fn() };
    teacherAssignmentsService = { findEntityByAssignmentId: jest.fn() };

    service = new PermissionService(
      permissionRepository,
      usersService,
      roomService,
      {} as any,
      {} as any,
      scheduleService,
      teacherAssignmentsService,
    );
  });

  it('creates a weekly permission without assignment for non-TEACHER users', async () => {
    usersService.findOne.mockResolvedValue(janitor);

    const result = await service.createWeeklySchedule({ userId: janitorId, roomId: 1, scheduleId: 1, createdById: adminId });

    expect(result.assignmentId).toBeNull();
    expect(result.assignment).toBeNull();
    expect(permissionRepository.save).toHaveBeenCalled();
  });

  it('rejects assignmentId for non-TEACHER users', async () => {
    usersService.findOne.mockResolvedValue(janitor);

    await expect(service.createWeeklySchedule({ userId: janitorId, roomId: 1, scheduleId: 1, assignmentId: 10, createdById: adminId }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates a teacher weekly permission with a valid active assignment', async () => {
    usersService.findOne.mockResolvedValue(teacher);
    teacherAssignmentsService.findEntityByAssignmentId.mockResolvedValue(activeAssignment);

    const result = await service.createWeeklySchedule({ userId: teacherId, roomId: 1, scheduleId: 1, assignmentId: 10, createdById: adminId });

    expect(result.assignmentId).toBe(10);
    expect(result.assignment).toBe(activeAssignment);
  });

  it('rejects an assignment that belongs to another teacher', async () => {
    usersService.findOne.mockResolvedValue(otherTeacher);
    teacherAssignmentsService.findEntityByAssignmentId.mockResolvedValue(activeAssignment);

    await expect(service.createWeeklySchedule({ userId: otherTeacherId, roomId: 1, scheduleId: 1, assignmentId: 10, createdById: adminId }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects inactive and nonexistent assignments', async () => {
    usersService.findOne.mockResolvedValue(teacher);
    teacherAssignmentsService.findEntityByAssignmentId.mockResolvedValueOnce({ ...activeAssignment, isActive: false });

    await expect(service.createWeeklySchedule({ userId: teacherId, roomId: 1, scheduleId: 1, assignmentId: 10, createdById: adminId }))
      .rejects.toBeInstanceOf(BadRequestException);

    teacherAssignmentsService.findEntityByAssignmentId.mockResolvedValueOnce(null);

    await expect(service.createWeeklySchedule({ userId: teacherId, roomId: 1, scheduleId: 1, assignmentId: 99, createdById: adminId }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects schedules that are not weekly', async () => {
    usersService.findOne.mockResolvedValue(janitor);
    scheduleService.findOne.mockResolvedValue(eventSchedule);

    await expect(service.createWeeklySchedule({ userId: janitorId, roomId: 1, scheduleId: 2, createdById: adminId }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('updates assignment with newAssignmentId', async () => {
    const permission = Object.assign(new PermissionEntity(), {
      userId: teacherId,
      roomId: 1,
      scheduleId: 1,
      user: teacher,
      room,
      schedule: weeklySchedule,
      assignmentId: null,
      assignment: null,
      createdById: adminId,
      isActive: true,
    });
    permissionRepository.findOne.mockResolvedValue(permission);
    teacherAssignmentsService.findEntityByAssignmentId.mockResolvedValue(activeAssignment);

    const result = await service.updateWeeklySchedule(teacherId, 1, 1, { userId: adminId }, { newAssignmentId: 10 });

    expect(result.assignmentId).toBe(10);
    expect(permissionRepository.save).toHaveBeenCalledWith(expect.objectContaining({ assignmentId: 10 }));
  });

  it('clears assignment with newAssignmentId null only for non-TEACHER users', async () => {
    const nonTeacherPermission = Object.assign(new PermissionEntity(), {
      userId: janitorId,
      roomId: 1,
      scheduleId: 1,
      user: janitor,
      room,
      schedule: weeklySchedule,
      assignmentId: 10,
      assignment: activeAssignment,
      createdById: adminId,
      isActive: true,
    });
    permissionRepository.findOne.mockResolvedValue(nonTeacherPermission);

    await expect(service.updateWeeklySchedule(janitorId, 1, 1, { userId: adminId }, { newAssignmentId: null })).resolves.toMatchObject({ assignmentId: null });

    const teacherPermission = Object.assign(new PermissionEntity(), { ...nonTeacherPermission, userId: teacherId, user: teacher });
    permissionRepository.findOne.mockResolvedValue(teacherPermission);

    await expect(service.updateWeeklySchedule(teacherId, 1, 1, { userId: adminId }, { newAssignmentId: null }))
      .rejects.toBeInstanceOf(BadRequestException);
  });
});
