import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class DropTeacherSubject20260517140000 implements MigrationInterface {
  name = 'DropTeacherSubject20260517140000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('teacher_subject')) {
      await queryRunner.dropTable('teacher_subject', true);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('teacher_subject')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'teacher_subject',
        columns: [
          { name: 'user_id', type: 'char', length: '36', isPrimary: true },
          { name: 'subject_id', type: 'bigint', isPrimary: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('teacher_subject', [
      new TableForeignKey({
        name: 'fk_teacher_subject_teacher',
        columnNames: ['user_id'],
        referencedTableName: 'teacher',
        referencedColumnNames: ['user_id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'fk_teacher_subject_subject',
        columnNames: ['subject_id'],
        referencedTableName: 'subject',
        referencedColumnNames: ['subject_id'],
        onDelete: 'RESTRICT',
      }),
    ]);
  }
}
