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
      tokenVersion: 17,
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
    {
      userId: '2371db6b-d998-4be1-955a-20a47b0b8cf7',
      name: 'Sergio',
      lastname: 'Pérez Rubalcaba',
      email: 'sergio@email.com',
      passwordHash,
      avatar: 'avatar_default_m4.png',
      validFrom: new Date('2026-02-02 07:19:39'),
      validTo: null,
      tokenVersion: 1,
    },
    {
      userId: '5c254cec-9b74-4fce-a280-069a20399901',
      name: 'Nombre',
      lastname: 'Apellidos',
      email: 'nuevo@email.com',
      passwordHash,
      avatar: 'avatar_default_f6.png',
      validFrom: new Date('2026-02-02 04:28:16'),
      validTo: null,
      tokenVersion: 1,
    },
    {
      userId: 'cb31d2bf-f1e2-4fd1-a674-5203370d8475',
      name: 'Francisco',
      lastname: 'Montés Doria',
      email: 'framondo@gmail.com',
      passwordHash,
      avatar: 'avatar_cb31d2bf-f1e2-4fd1-a674-5203370d8475_1771777098015.jpg',
      validFrom: new Date('2026-02-01 16:21:46'),
      validTo: null,
      tokenVersion: 1,
    },
    {
      userId: 'ee79b47a-5afe-4009-b3ed-f23bbf737ba7',
      name: 'Pepe',
      lastname: 'Tenaz Pérez',
      email: 'pepe@email.com',
      passwordHash,
      avatar: 'avatar_default_m3.png',
      validFrom: new Date('2026-02-02 07:55:50'),
      validTo: null,
      tokenVersion: 1,
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
