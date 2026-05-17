import 'reflect-metadata';
import { TagController } from './tag.controller';
import { TagType } from '../../domain/enums/tag-type.enum';
import { TagEntity } from '../../domain/entities/tag.entity';
import { RoleName } from '../../../users/domain/enums/rolename.enum';
import { ROLES_KEY } from '../../../auth/infrastructure/decorators/roles.decorator';

describe('TagController credentials', () => {
  const tag = {
    tagId: 1,
    tagCode: 'hashed',
    type: TagType.RFID,
    issuedAt: new Date('2026-05-11T10:00:00.000Z'),
    isActive: true,
    user: {
      userId: 'user-admin-target',
      name: 'Ana',
      lastname: 'Ruiz',
      email: 'ana@example.com',
      avatar: null,
      roles: [],
      validFrom: new Date('2026-05-11T10:00:00.000Z'),
      validTo: null,
      createdAt: new Date('2026-05-11T10:00:00.000Z'),
    } as any,
  } as TagEntity;

  it('admin create uses the body userId instead of an authenticated user', async () => {
    const tagService = {
      create: jest.fn().mockResolvedValue({ tag, mobileCredential: 'mobile-secret' }),
    };
    const controller = new TagController(tagService as any);

    const response = await controller.createAdmin({ userId: 'target-user', type: TagType.NFC_MOBILE });

    expect(tagService.create).toHaveBeenCalledWith({ userId: 'target-user', type: TagType.NFC_MOBILE, rawUid: undefined });
    expect(response.mobileCredential).toBe('mobile-secret');
  });

  it('marks admin creation and patch as ADMIN only', () => {
    expect(Reflect.getMetadata(ROLES_KEY, TagController.prototype.createAdmin)).toEqual([RoleName.ADMIN]);
    expect(Reflect.getMetadata(ROLES_KEY, TagController.prototype.updateTagCode)).toEqual([RoleName.ADMIN]);
  });

  it('returns the Spanish soft delete message', async () => {
    const tagService = { softRemove: jest.fn().mockResolvedValue(undefined) };
    const controller = new TagController(tagService as any);

    await expect(controller.softRemove(1)).resolves.toEqual({ message: 'Credencial desactivada con éxito' });
  });
});
