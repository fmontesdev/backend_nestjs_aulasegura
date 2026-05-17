import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateTeacherSubjectCourse20260517120000 implements MigrationInterface {
  name = 'CreateTeacherSubjectCourse20260517120000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'teacher_subject_course',
        columns: [
          { name: 'user_id', type: 'char', length: '36', isPrimary: true },
          { name: 'subject_id', type: 'bigint', isPrimary: true },
          { name: 'course_id', type: 'int', isPrimary: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'is_active', type: 'boolean', default: true },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'teacher_subject_course',
      new TableIndex({
        name: 'idx_teacher_subject_course_course_subject',
        columnNames: ['course_id', 'subject_id'],
      }),
    );

    await queryRunner.createIndex(
      'teacher_subject_course',
      new TableIndex({
        name: 'idx_teacher_subject_course_subject',
        columnNames: ['subject_id'],
      }),
    );

    await queryRunner.createForeignKeys('teacher_subject_course', [
      new TableForeignKey({
        name: 'fk_teacher_subject_course_teacher',
        columnNames: ['user_id'],
        referencedTableName: 'teacher',
        referencedColumnNames: ['user_id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'fk_teacher_subject_course_course_subject',
        columnNames: ['course_id', 'subject_id'],
        referencedTableName: 'course_subject',
        referencedColumnNames: ['course_id', 'subject_id'],
        onDelete: 'RESTRICT',
      }),
    ]);

    if (await queryRunner.hasTable('teacher_subject')) {
      await queryRunner.query(`
        INSERT IGNORE INTO teacher_subject_course (user_id, subject_id, course_id)
        SELECT
          ts.user_id,
          ts.subject_id,
          MIN(cs.course_id) AS course_id
        FROM teacher_subject ts
        INNER JOIN course_subject cs ON cs.subject_id = ts.subject_id
        GROUP BY ts.user_id, ts.subject_id
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('teacher_subject_course', true);
  }
}
