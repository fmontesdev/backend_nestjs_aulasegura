import { BadRequestException, ConflictException } from '@nestjs/common';
import { createHmac } from 'crypto';
import { TagService } from './tag.service';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagType } from '../../domain/enums/tag-type.enum';
import { UserEntity } from '../../../users/domain/entities/user.entity';

describe('TagService credentials', () => {
  let service: TagService;
  let tagRepository: jest.Mocked<TagRepository>;
  let usersService: { findOne: jest.Mock };

  const pepper = 'test-pepper';
  const user = {
    userId: '11111111-1111-1111-1111-111111111111',
    name: 'Ana',
    lastname: 'Ruiz',
    email: 'ana@example.com',
    createdAt: new Date('2026-05-11T10:00:00.000Z'),
    validFrom: new Date('2026-05-11T10:00:00.000Z'),
    roles: [],
  } as unknown as UserEntity;

  const hashCredential = (raw: string) => createHmac('sha256', pepper).update(raw).digest().subarray(0, 16).toString('base64url');

  beforeEach(() => {
    tagRepository = {
      findAll: jest.fn(),
      findAllWithFilters: jest.fn(),
      findOneById: jest.fn(),
      findOneActiveById: jest.fn(),
      findOneByTagCode: jest.fn().mockResolvedValue(null),
      findActiveByUserIdAndType: jest.fn().mockResolvedValue([]),
      save: jest.fn(async (tag: TagEntity) => ({ ...tag, tagId: tag.tagId ?? 1, issuedAt: new Date('2026-05-11T10:00:00.000Z') }) as TagEntity),
    };
    usersService = { findOne: jest.fn().mockResolvedValue(user) };

    service = new TagService(tagRepository, usersService as any, { get: jest.fn().mockReturnValue(pepper) } as any);
  });

  it('creates an admin RFID credential for the provided user and hashes rawUid', async () => {
    const result = await service.create({ userId: user.userId, type: TagType.RFID, rawUid: '04AABBCCDD22' });

    expect(usersService.findOne).toHaveBeenCalledWith(user.userId);
    expect(result.mobileCredential).toBeUndefined();
    expect(result.tag.tagCode).toBe(hashCredential('04AABBCCDD22'));
    expect(result.tag.user).toBe(user);
  });

  it('requires rawUid for RFID creation', async () => {
    await expect(service.create({ userId: user.userId, type: TagType.RFID })).rejects.toBeInstanceOf(BadRequestException);
    expect(tagRepository.save).not.toHaveBeenCalled();
  });

  it('creates nfc_mobile without rawUid and returns a non-persisted mobileCredential', async () => {
    const result = await service.create({ userId: user.userId, type: TagType.NFC_MOBILE });

    expect(result.mobileCredential).toEqual(expect.any(String));
    expect(result.mobileCredential).not.toBe(result.tag.tagCode);
    expect(result.tag.tagCode).toBe(hashCredential(result.mobileCredential!));
    expect(Object.prototype.hasOwnProperty.call(result.tag, 'mobileCredential')).toBe(false);
  });

  it('creates a new active nfc_mobile credential when the user has none', async () => {
    const result = await service.create({ userId: user.userId, type: TagType.NFC_MOBILE });

    expect(usersService.findOne).toHaveBeenCalledWith(user.userId);
    expect(tagRepository.findActiveByUserIdAndType).toHaveBeenCalledWith(user.userId, TagType.NFC_MOBILE);
    expect(result.mobileCredential).toEqual(expect.any(String));
    expect(result.tag.type).toBe(TagType.NFC_MOBILE);
    expect(result.tag.user).toBe(user);
    expect(result.tag.tagCode).toBe(hashCredential(result.mobileCredential!));
  });

  it('regenerates an existing active nfc_mobile credential and invalidates duplicates', async () => {
    const existingTag = {
      tagId: 7,
      tagCode: 'old-mobile-hash',
      type: TagType.NFC_MOBILE,
      user,
      userId: user.userId,
      isActive: true,
      issuedAt: new Date('2026-05-10T10:00:00.000Z'),
    } as TagEntity;
    const duplicateTag = {
      tagId: 8,
      tagCode: 'duplicated-mobile-hash',
      type: TagType.NFC_MOBILE,
      user,
      userId: user.userId,
      isActive: true,
      issuedAt: new Date('2026-05-09T10:00:00.000Z'),
    } as TagEntity;
    tagRepository.findActiveByUserIdAndType.mockResolvedValue([existingTag, duplicateTag]);

    const result = await service.create({ userId: user.userId, type: TagType.NFC_MOBILE });

    expect(result.tag.tagId).toBe(7);
    expect(result.mobileCredential).toEqual(expect.any(String));
    expect(existingTag.tagCode).toBe(hashCredential(result.mobileCredential!));
    expect(duplicateTag.isActive).toBe(false);
    expect(tagRepository.save).toHaveBeenCalledWith(duplicateTag);
    expect(tagRepository.save).toHaveBeenCalledWith(expect.objectContaining({ tagId: 7, isActive: true }));
  });

  it('regenerates only RFID credentials and ignores self-conflict', async () => {
    const existingTag = { tagId: 7, tagCode: 'old', type: TagType.RFID, user, userId: user.userId, isActive: true } as TagEntity;
    tagRepository.findOneById.mockResolvedValue(existingTag);
    tagRepository.findOneByTagCode.mockResolvedValue({ ...existingTag, tagCode: hashCredential('04AABBCCDD22') });

    const updated = await service.updateTagCode(7, { rawUid: '04AABBCCDD22' });

    expect(updated.tagCode).toBe(hashCredential('04AABBCCDD22'));
    expect(tagRepository.save).toHaveBeenCalledWith(expect.objectContaining({ tagId: 7, tagCode: hashCredential('04AABBCCDD22') }));
  });

  it('rejects RFID regeneration when the new code belongs to another tag', async () => {
    tagRepository.findOneById.mockResolvedValue({ tagId: 7, tagCode: 'old', type: TagType.RFID } as TagEntity);
    tagRepository.findOneByTagCode.mockResolvedValue({ tagId: 8, tagCode: hashCredential('04AABBCCDD22') } as TagEntity);

    await expect(service.updateTagCode(7, { rawUid: '04AABBCCDD22' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects rawUid regeneration for nfc_mobile credentials', async () => {
    tagRepository.findOneById.mockResolvedValue({ tagId: 7, tagCode: 'old', type: TagType.NFC_MOBILE } as TagEntity);

    await expect(service.updateTagCode(7, { rawUid: '04AABBCCDD22' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('soft deletes by setting isActive=false', async () => {
    const tag = { tagId: 3, isActive: true } as TagEntity;
    tagRepository.findOneActiveById.mockResolvedValue(tag);

    await service.softRemove(3);

    expect(tag.isActive).toBe(false);
    expect(tagRepository.save).toHaveBeenCalledWith(tag);
  });
});
