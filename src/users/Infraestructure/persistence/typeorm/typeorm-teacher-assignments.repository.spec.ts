import { TypeormTeacherAssignmentsRepository } from './typeorm-teacher-assignments.repository';

describe('TypeormTeacherAssignmentsRepository', () => {
  const createRepository = () => {
    const queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[{ userId: 'teacher-1' }], 1]),
    };
    const assignmentRepo = {
      createQueryBuilder: jest.fn(() => queryBuilder),
      find: jest.fn().mockResolvedValue([{ userId: 'teacher-1', isActive: true }]),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const repository = new TypeormTeacherAssignmentsRepository({} as never, {} as never, {} as never, assignmentRepo as never, {} as never);

    return { repository, queryBuilder, assignmentRepo };
  };

  it('defaults global assignment listing to active assignments', async () => {
    const { repository, queryBuilder } = createRepository();

    const result = await repository.findAllWithFilters({ page: 1, limit: 10 });

    expect(queryBuilder.andWhere).toHaveBeenCalledWith('assignment.isActive = :isActive', { isActive: true });
    expect(result).toEqual({ data: [{ userId: 'teacher-1' }], total: 1, page: 1, limit: 10, totalPages: 1 });
  });

  it('respects explicit inactive filter in global assignment listing', async () => {
    const { repository, queryBuilder } = createRepository();

    await repository.findAllWithFilters({ page: 1, limit: 10, isActive: false });

    expect(queryBuilder.andWhere).toHaveBeenCalledWith('assignment.isActive = :isActive', { isActive: false });
  });

  it('defaults per-teacher assignment listing to active assignments', async () => {
    const { repository, assignmentRepo } = createRepository();

    const result = await repository.findByTeacherId('teacher-1');

    expect(assignmentRepo.find).toHaveBeenCalledWith({
      where: { userId: 'teacher-1', isActive: true },
      relations: ['teacher', 'teacher.user', 'course', 'subject'],
      order: { courseId: 'ASC', subjectId: 'ASC' },
    });
    expect(result).toEqual([{ userId: 'teacher-1', isActive: true }]);
  });

  it('soft deletes assignments by marking them inactive', async () => {
    const { repository, assignmentRepo } = createRepository();

    await repository.softDelete('teacher-1', 10, 20);

    expect(assignmentRepo.update).toHaveBeenCalledWith(
      { userId: 'teacher-1', courseId: 10, subjectId: 20 },
      { isActive: false },
    );
  });
});
