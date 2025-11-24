import { DataSource } from 'typeorm';

export const seedTeacherSubject = async (dataSource: DataSource): Promise<void> => {
  await dataSource.query(`
    INSERT INTO \`teacher_subject\` (\`user_id\`, \`subject_id\`) VALUES
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 99),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 101),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 102),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 104),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 108),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 124),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 127),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 132),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 136),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 143)
    ON DUPLICATE KEY UPDATE user_id = user_id
  `);

  console.log('teacher_subject relationships created');
};
