import { DataSource } from 'typeorm';

export const seedRoleUsers = async (dataSource: DataSource): Promise<void> => {
  await dataSource.query(`
    INSERT INTO role_user (user_id, role_id) VALUES
    ('2d9ce2e0-b172-4756-8c92-c647e3f0a649', 1),
    ('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 2),
    ('6b86f7e7-bf19-4117-b262-a1221c4ced55', 2),
    ('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 3),
    ('c3496420-0e39-4af4-951e-5b11f54e5022', 4)
    ON DUPLICATE KEY UPDATE role_id = role_id
  `);

  console.log('User-Role relationships created');
};
