import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddAssignmentIdToTeacherSubjectCourse20260517130000 implements MigrationInterface {
  name = 'AddAssignmentIdToTeacherSubjectCourse20260517130000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'teacher_subject_course',
      new TableColumn({
        name: 'assignment_id',
        type: 'bigint',
        isNullable: true,
      }),
    );

    await queryRunner.query('SET @teacher_subject_course_assignment_id := 0');
    await queryRunner.query(`
      UPDATE \`teacher_subject_course\`
      SET \`assignment_id\` = (@teacher_subject_course_assignment_id := @teacher_subject_course_assignment_id + 1)
      WHERE \`assignment_id\` IS NULL
      ORDER BY \`user_id\`, \`course_id\`, \`subject_id\`
    `);

    await queryRunner.changeColumn(
      'teacher_subject_course',
      'assignment_id',
      new TableColumn({
        name: 'assignment_id',
        type: 'bigint',
        isNullable: false,
      }),
    );

    await queryRunner.createIndex(
      'teacher_subject_course',
      new TableIndex({
        name: 'idx_teacher_subject_course_teacher',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.dropPrimaryKey('teacher_subject_course');
    await queryRunner.createPrimaryKey('teacher_subject_course', ['assignment_id']);
    await queryRunner.changeColumn(
      'teacher_subject_course',
      'assignment_id',
      new TableColumn({
        name: 'assignment_id',
        type: 'bigint',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }),
    );
    await queryRunner.createIndex(
      'teacher_subject_course',
      new TableIndex({
        name: 'uq_teacher_subject_course_natural_assignment',
        columnNames: ['user_id', 'course_id', 'subject_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('teacher_subject_course', 'uq_teacher_subject_course_natural_assignment');
    await queryRunner.changeColumn(
      'teacher_subject_course',
      'assignment_id',
      new TableColumn({
        name: 'assignment_id',
        type: 'bigint',
        isPrimary: true,
        isNullable: false,
      }),
    );
    await queryRunner.dropPrimaryKey('teacher_subject_course');
    await queryRunner.createPrimaryKey('teacher_subject_course', ['user_id', 'subject_id', 'course_id']);
    await queryRunner.dropIndex('teacher_subject_course', 'idx_teacher_subject_course_teacher');
    await queryRunner.dropColumn('teacher_subject_course', 'assignment_id');
  }
}
