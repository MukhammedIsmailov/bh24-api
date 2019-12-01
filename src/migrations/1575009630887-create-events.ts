import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class createEvents1575009630887 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'event',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'event_log',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'created_date',
                    type: 'timestamp',
                    isNullable: false
                },
                {
                    name: 'payload_data',
                    type: 'json',
                    isNullable: false,
                    default: "'{}'"
                },
            ]
        }),true);

        await queryRunner.addColumn('event', new TableColumn({
            name: 'partner_id',
            type: 'int'
        }));

        await queryRunner.createForeignKey('event', new TableForeignKey({
            columnNames: ['partner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'partner',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('event');
    }
}
