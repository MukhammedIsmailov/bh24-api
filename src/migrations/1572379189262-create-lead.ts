import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class createLead1572379189262 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'lead',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                }
            ]
        }), true);

        await queryRunner.addColumn('lead', new TableColumn({
            name: 'partner_id',
            type: 'int'
        }));

        await queryRunner.createForeignKey('lead', new TableForeignKey({
            columnNames: ['partner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'partner',
            onDelete: 'CASCADE'
        }));


    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('lead');
    }
}
