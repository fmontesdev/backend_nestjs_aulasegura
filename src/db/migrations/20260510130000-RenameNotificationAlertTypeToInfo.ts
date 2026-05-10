import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameNotificationAlertTypeToInfo20260510130000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE notification MODIFY type ENUM('access', 'warning', 'alert', 'info') NOT NULL");
    await queryRunner.query("UPDATE notification SET type = 'info' WHERE type = 'alert'");
    await queryRunner.query("ALTER TABLE notification MODIFY type ENUM('access', 'warning', 'info') NOT NULL");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE notification MODIFY type ENUM('access', 'warning', 'alert', 'info') NOT NULL");
    await queryRunner.query("UPDATE notification SET type = 'alert' WHERE type = 'info'");
    await queryRunner.query("ALTER TABLE notification MODIFY type ENUM('access', 'warning', 'alert') NOT NULL");
  }
}
