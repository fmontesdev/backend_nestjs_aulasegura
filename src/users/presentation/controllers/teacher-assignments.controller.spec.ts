import { TeacherAssignmentsService } from '../../application/services/teacher-assignments.service';
import { TeacherAssignmentsController } from './teacher-assignments.controller';

describe('TeacherAssignmentsController', () => {
  let controller: TeacherAssignmentsController;
  let service: jest.Mocked<TeacherAssignmentsService>;

  beforeEach(() => {
    service = {
      findAllWithFilters: jest.fn().mockResolvedValue({ data: [], total: 0, page: 2, limit: 5, totalPages: 0 }),
      findByTeacherId: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TeacherAssignmentsService>;

    controller = new TeacherAssignmentsController(service);
  });

  it('parses query filters and passes them to the service', async () => {
    const result = await controller.findAll({
      page: 2,
      limit: 5,
      filters: 'profesor:Ana,course:10,subject:20,active:false',
    });

    expect(service.findAllWithFilters).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
      teacher: 'Ana',
      course: '10',
      courseId: 10,
      subject: '20',
      subjectId: 20,
      isActive: false,
    });
    expect(result).toEqual({
      data: [],
      meta: { page: 2, limit: 5, total: 0, totalPages: 0 },
    });
  });

  it('creates assignments using identifiers from the request body', async () => {
    const dto = { teacherId: 'teacher-1', courseId: 10, subjectId: 20 };
    const response = { teacher: {}, course: {}, subject: {}, createdAt: new Date(), isActive: true } as never;
    service.create.mockResolvedValue(response);

    await expect(controller.create(dto)).resolves.toBe(response);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('deletes assignments using identifiers from the request body', async () => {
    const dto = { teacherId: 'teacher-1', courseId: 10, subjectId: 20 };

    await expect(controller.delete(dto)).resolves.toEqual({ message: 'Teacher assignment deleted' });
    expect(service.delete).toHaveBeenCalledWith(dto.teacherId, dto.courseId, dto.subjectId);
  });
});
