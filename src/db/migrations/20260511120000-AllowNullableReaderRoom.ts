import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AllowNullableReaderRoom20260511120000 implements MigrationInterface {
  name = 'AllowNullableReaderRoom20260511120000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const readerTable = await queryRunner.getTable('reader');
    const roomForeignKey = readerTable?.foreignKeys.find((foreignKey) => foreignKey.columnNames.includes('room_id'));

    if (roomForeignKey) {
      await queryRunner.dropForeignKey('reader', roomForeignKey);
    }

    await queryRunner.changeColumn(
      'reader',
      'room_id',
      new TableColumn({
        name: 'room_id',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'reader',
      new TableForeignKey({
        name: 'fk_reader_room',
        columnNames: ['room_id'],
        referencedTableName: 'room',
        referencedColumnNames: ['room_id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const readerTable = await queryRunner.getTable('reader');
    const roomForeignKey = readerTable?.foreignKeys.find((foreignKey) => foreignKey.columnNames.includes('room_id'));

    if (roomForeignKey) {
      await queryRunner.dropForeignKey('reader', roomForeignKey);
    }

    await queryRunner.changeColumn(
      'reader',
      'room_id',
      new TableColumn({
        name: 'room_id',
        type: 'int',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'reader',
      new TableForeignKey({
        name: 'fk_reader_room',
        columnNames: ['room_id'],
        referencedTableName: 'room',
        referencedColumnNames: ['room_id'],
        onDelete: 'RESTRICT',
      }),
    );
  }
}
