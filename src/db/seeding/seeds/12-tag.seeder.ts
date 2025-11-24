import { DataSource } from 'typeorm';
import { TagEntity } from '../../../tags/domain/entities/tag.entity';
import { TagType } from '../../../tags/domain/enums/tag-type.enum';

export const seedTags = async (dataSource: DataSource): Promise<void> => {
  const tagRepo = dataSource.getRepository(TagEntity);

  const tags = [
    { tagId: 1, tagCode: 'eg6QmXdw64GyALEOvDlTjg', userId: '1a1fcf19-6cbc-4d30-be9f-59f337c633a5', type: TagType.NFC_MOBILE, issuedAt: new Date('2025-11-08 16:43:56'), isActive: true },
    { tagId: 2, tagCode: 'M9MS_v0GcE7GzreKZdaaAA', userId: '2d9ce2e0-b172-4756-8c92-c647e3f0a649', type: TagType.NFC_MOBILE, issuedAt: new Date('2025-11-08 16:43:56'), isActive: true },
    { tagId: 3, tagCode: 'ZOD08vIoypmyRKjfIPy_Fg', userId: '2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', type: TagType.NFC_MOBILE, issuedAt: new Date('2025-11-08 16:43:56'), isActive: true },
    { tagId: 4, tagCode: 'zhO5seOQje-KXK6Kag5OUQ', userId: '6b86f7e7-bf19-4117-b262-a1221c4ced55', type: TagType.NFC_MOBILE, issuedAt: new Date('2025-11-08 16:43:56'), isActive: true },
    { tagId: 5, tagCode: 'x4m7QsJ12Le8p2WbXjvn1w', userId: 'c3496420-0e39-4af4-951e-5b11f54e5022', type: TagType.NFC_MOBILE, issuedAt: new Date('2025-11-08 16:43:56'), isActive: true },
    { tagId: 6, tagCode: 'OBxCH99hvOFndRkmVOPrJw', userId: '1a1fcf19-6cbc-4d30-be9f-59f337c633a5', type: TagType.RFID, issuedAt: new Date('2025-11-08 16:43:56'), isActive: true },
    { tagId: 7, tagCode: 'm4mckw7MpJgmFMeq1GNr2g', userId: '2d9ce2e0-b172-4756-8c92-c647e3f0a649', type: TagType.RFID, issuedAt: new Date('2025-11-08 16:43:56'), isActive: true },
    { tagId: 8, tagCode: '06yZo5FVGxLSYUvZfqmfSQ', userId: '2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', type: TagType.RFID, issuedAt: new Date('2025-11-08 16:43:56'), isActive: true },
    { tagId: 9, tagCode: 'sYp2HKAJMB4Q-ZmFygKjeA', userId: '6b86f7e7-bf19-4117-b262-a1221c4ced55', type: TagType.RFID, issuedAt: new Date('2025-11-08 16:43:56'), isActive: true },
    { tagId: 10, tagCode: '4YGxKkADpDp-cSBVikZvWw', userId: 'c3496420-0e39-4af4-951e-5b11f54e5022', type: TagType.RFID, issuedAt: new Date('2025-11-08 16:43:56'), isActive: true },
  ];

  for (const data of tags) {
    const exists = await tagRepo.findOne({ where: { tagId: data.tagId } });
    if (!exists) {
      const tag = tagRepo.create(data);
      await tagRepo.save(tag);
      console.log(`Tag created: ${data.tagCode} (${data.type})`);
    } else {
      console.log(`Tag already exists: ${data.tagCode}`);
    }
  }
};
