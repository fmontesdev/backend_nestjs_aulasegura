import { DataSource } from 'typeorm';

export const seedRoleUsers = async (dataSource: DataSource): Promise<void> => {
  await dataSource.query(`
    INSERT INTO role_user (user_id, role_id) VALUES
    ('2371db6b-d998-4be1-955a-20a47b0b8cf7', 1),
    ('2d9ce2e0-b172-4756-8c92-c647e3f0a649', 1),
    ('2371db6b-d998-4be1-955a-20a47b0b8cf7', 2),
    ('2d9ce2e0-b172-4756-8c92-c647e3f0a649', 2),
    ('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 2),
    ('6b86f7e7-bf19-4117-b262-a1221c4ced55', 2),
    ('cb31d2bf-f1e2-4fd1-a674-5203370d8475', 2),
    ('ee79b47a-5afe-4009-b3ed-f23bbf737ba7', 2),
    ('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 3),
    ('5c254cec-9b74-4fce-a280-069a20399901', 3),
    ('c3496420-0e39-4af4-951e-5b11f54e5022', 4)
    ON DUPLICATE KEY UPDATE role_id = role_id
  `);

  console.log('User-Role relationships created');
};
