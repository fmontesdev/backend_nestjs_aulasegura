import { DataSource } from 'typeorm';

export const seedTeacher = async (dataSource: DataSource): Promise<void> => {
  await dataSource.query(`
    INSERT INTO \`teacher\` (\`user_id\`, \`department_id\`) VALUES
('2d9ce2e0-b172-4756-8c92-c647e3f0a649', 2),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 6),
('2371db6b-d998-4be1-955a-20a47b0b8cf7', 7),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 7),
('cb31d2bf-f1e2-4fd1-a674-5203370d8475', 7),
('ee79b47a-5afe-4009-b3ed-f23bbf737ba7', 17)
    ON DUPLICATE KEY UPDATE user_id = user_id
  `);

  console.log('teacher relationships created');
};
