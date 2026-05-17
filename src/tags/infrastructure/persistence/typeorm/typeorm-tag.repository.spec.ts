import { TypeOrmTagRepository } from './typeorm-tag.repository';
import { TagType } from '../../../domain/enums/tag-type.enum';

describe('TypeOrmTagRepository findAllWithFilters', () => {
  const createRepository = () => {
    const queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[{ tagId: 1 }], 11]),
    };
    const repository = new TypeOrmTagRepository({ createQueryBuilder: jest.fn(() => queryBuilder) } as any);

    return { repository, queryBuilder };
  };

  it('joins user, applies pagination, and returns standard meta data', async () => {
    const { repository, queryBuilder } = createRepository();

    const result = await repository.findAllWithFilters({ page: 2, limit: 5, isActive: false });

    expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('tag.user', 'user');
    expect(queryBuilder.where).toHaveBeenCalledWith('tag.isActive = :isActive', { isActive: false });
    expect(queryBuilder.skip).toHaveBeenCalledWith(5);
    expect(queryBuilder.take).toHaveBeenCalledWith(5);
    expect(result).toEqual({ data: [{ tagId: 1 }], total: 11, page: 2, limit: 5, totalPages: 3 });
  });

  it('filters by type, user, email and global search without exposing tagCode search', async () => {
    const { repository, queryBuilder } = createRepository();

    await repository.findAllWithFilters({
      page: 1,
      limit: 10,
      globalSearch: ['ana'],
      type: TagType.RFID,
      user: 'Ruiz',
      email: 'ana@example.com',
    });

    expect(queryBuilder.andWhere).toHaveBeenCalledWith(expect.stringContaining('LOWER(user.email)'), { global0: '%ana%' });
    expect(queryBuilder.andWhere).not.toHaveBeenCalledWith(expect.stringContaining('LOWER(tag.tagCode)'), expect.anything());
    expect(queryBuilder.andWhere).toHaveBeenCalledWith('tag.type = :type', { type: TagType.RFID });
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(expect.stringContaining('LOWER(user.name)'), { user: '%Ruiz%' });
    expect(queryBuilder.andWhere).toHaveBeenCalledWith('LOWER(user.email) LIKE LOWER(:email)', { email: '%ana@example.com%' });
  });
});
