import { DataSource } from 'typeorm';

export const seedTeacher = async (dataSource: DataSource): Promise<void> => {
  await dataSource.query(`
    INSERT INTO \`teacher\` (\`user_id\`, \`department_id\`) VALUES
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 6),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 7)
    ON DUPLICATE KEY UPDATE user_id = user_id
  `);

  console.log('teacher relationships created');
};
