import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';
export class createNotificationsTable1580118091773 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'notification',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'created_date',
                    type: 'timestamp',
                    isNullable: false,
                },
                {
                    name: 'updated_date',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'deleted_date',
                    type: 'timestamp',
                    isNullable: true,
                },
            ],
        }), true);

        await queryRunner.addColumn('notification', new TableColumn({
            name: 'lead_id',
            type: 'int'
        }));

        await queryRunner.createForeignKey('notification', new TableForeignKey({
            columnNames: ['lead_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));

        await queryRunner.addColumn('notification', new TableColumn({
            name: 'leader_id',
            type: 'int'
        }));

        await queryRunner.createForeignKey('notification', new TableForeignKey({
            columnNames: ['leader_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));

        await queryRunner.addColumn('notification', new TableColumn({
            name: 'messenger_id',
            type: 'int'
        }));

        await queryRunner.createForeignKey('notification', new TableForeignKey({
            columnNames: ['messenger_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'lead_messengers',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('notification');
    }
}
