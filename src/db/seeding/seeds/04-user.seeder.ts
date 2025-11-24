import { DataSource } from 'typeorm';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { hash as bcryptHash } from '@node-rs/bcrypt';

export const seedUsers = async (dataSource: DataSource): Promise<void> => {
  const userRepo = dataSource.getRepository(UserEntity);

  // Password: AulaSegura@1234 (hash bcrypt pre-generado)
  const passwordHash = await bcryptHash('AulaSegura@1234', 12);

  const users = [
    {
      userId: '2d9ce2e0-b172-4756-8c92-c647e3f0a649',
      name: 'Ana',
      lastname: 'Morales Martínez',
      email: 'admin@gva.es',
      passwordHash,
      avatar: 'avatar_2d9ce2e0-b172-4756-8c92-c647e3f0a649.webp',
      validFrom: new Date('2025-10-05 05:33:04'),
      validTo: null,
      tokenVersion: 3,
    },
    {
      userId: '2f09b2f8-3e2a-4cb6-b907-e98db842b4ee',
      name: 'Luis',
      lastname: 'Torregrosa Pérez',
      email: 'teacher@gva.es',
      passwordHash,
      avatar: 'avatar_2f09b2f8-3e2a-4cb6-b907-e98db842b4ee.webp',
      validFrom: new Date('2025-10-05 05:33:04'),
      validTo: null,
      tokenVersion: 2,
    },
    {
      userId: '6b86f7e7-bf19-4117-b262-a1221c4ced55',
      name: 'Paco',
      lastname: 'García Donat',
      email: 'pagado@gva.es',
      passwordHash,
      avatar: 'avatar_6b86f7e7-bf19-4117-b262-a1221c4ced55.webp',
      validFrom: new Date('2025-11-04 09:15:32'),
      validTo: null,
      tokenVersion: 15,
    },
    {
      userId: '1a1fcf19-6cbc-4d30-be9f-59f337c633a5',
      name: 'Marta',
      lastname: 'Fernández Ruiz',
      email: 'janitor@gva.es',
      passwordHash,
      avatar: 'avatar_1a1fcf19-6cbc-4d30-be9f-59f337c633a5.webp',
      validFrom: new Date('2025-10-05 05:33:04'),
      validTo: null,
      tokenVersion: 3,
    },
    {
      userId: 'c3496420-0e39-4af4-951e-5b11f54e5022',
      name: 'Eva',
      lastname: 'Mendes López',
      email: 'staff@gva.es',
      passwordHash,
      avatar: 'avatar_c3496420-0e39-4af4-951e-5b11f54e5022.webp',
      validFrom: new Date('2025-10-05 05:33:04'),
      validTo: null,
      tokenVersion: 2,
    },
  ];

  for (const data of users) {
    const exists = await userRepo.findOne({ where: { userId: data.userId } });
    if (!exists) {
      const user = userRepo.create(data);
      await userRepo.save(user);
      console.log(`User created: ${data.email}`);
    } else {
      console.log(`User already exists: ${data.email}`);
    }
  }
};
