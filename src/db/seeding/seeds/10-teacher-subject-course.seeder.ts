import { DataSource } from 'typeorm';

export const seedTeacherSubjectCourse = async (dataSource: DataSource): Promise<void> => {
  await dataSource.query(`
    INSERT INTO \`teacher_subject_course\` (\`user_id\`, \`course_id\`, \`subject_id\`) VALUES
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 7, 99),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 7, 101),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 8, 102),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 8, 104),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 9, 108),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 13, 124),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 13, 127),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 15, 132),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 15, 136),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 17, 143)
    ON DUPLICATE KEY UPDATE user_id = user_id
  `);

  console.log('teacher_subject_course assignments created');
};
