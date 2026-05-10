import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddReasonStatusToAccessLog20260510120000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'access_log',
      new TableColumn({
        name: 'reason_status',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('access_log', 'reason_status');
  }
}
