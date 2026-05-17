import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class AddAssignmentToPermission20260517150000 implements MigrationInterface {
  name = 'AddAssignmentToPermission20260517150000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissionTable = await queryRunner.getTable('permission');
    const hasAssignmentColumn = permissionTable?.findColumnByName('assignment_id');

    if (!hasAssignmentColumn) {
      await queryRunner.addColumn(
        'permission',
        new TableColumn({
          name: 'assignment_id',
          type: 'bigint',
          isNullable: true,
        }),
      );
    }

    const tableAfterColumn = await queryRunner.getTable('permission');
    const hasAssignmentIndex = tableAfterColumn?.indices.some((index) => index.name === 'idx_permission_assignment');

    if (!hasAssignmentIndex) {
      await queryRunner.createIndex(
        'permission',
        new TableIndex({
          name: 'idx_permission_assignment',
          columnNames: ['assignment_id'],
        }),
      );
    }

    const tableAfterIndex = await queryRunner.getTable('permission');
    const hasAssignmentForeignKey = tableAfterIndex?.foreignKeys.some((foreignKey) =>
      foreignKey.columnNames.includes('assignment_id'),
    );

    if (!hasAssignmentForeignKey) {
      await queryRunner.createForeignKey(
        'permission',
        new TableForeignKey({
          name: 'fk_permission_teacher_subject_course_assignment',
          columnNames: ['assignment_id'],
          referencedTableName: 'teacher_subject_course',
          referencedColumnNames: ['assignment_id'],
          onDelete: 'RESTRICT',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const permissionTable = await queryRunner.getTable('permission');
    const assignmentForeignKey = permissionTable?.foreignKeys.find((foreignKey) =>
      foreignKey.columnNames.includes('assignment_id'),
    );

    if (assignmentForeignKey) {
      await queryRunner.dropForeignKey('permission', assignmentForeignKey);
    }

    const tableAfterForeignKey = await queryRunner.getTable('permission');
    const assignmentIndex = tableAfterForeignKey?.indices.find((index) => index.name === 'idx_permission_assignment');

    if (assignmentIndex) {
      await queryRunner.dropIndex('permission', assignmentIndex);
    }

    const tableAfterIndex = await queryRunner.getTable('permission');
    const assignmentColumn = tableAfterIndex?.findColumnByName('assignment_id');

    if (assignmentColumn) {
      await queryRunner.dropColumn('permission', 'assignment_id');
    }
  }
}
