import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class createLeadMessengers1572791047099 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'lead_messengers',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'telegram_info',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'facebook_info',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'viber_info',
                    type: 'varchar',
                    isNullable: true
                }
            ]
        }), true);

        await queryRunner.addColumn('lead_messengers', new TableColumn({
            name: 'lead_id',
            type: 'int'
        }));

        await queryRunner.createForeignKey('lead_messengers', new TableForeignKey({
            columnNames: ['lead_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'lead',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('lead_messengers');
    }
}
