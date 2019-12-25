import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class addLeadIdForEvents1577264429220 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('event', new TableColumn({
            name: 'lead_id',
            type: 'int',
            isNullable: true,
        }));

        await queryRunner.createForeignKey('event', new TableForeignKey({
            columnNames: ['lead_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('event', 'lead_id');
    }
}
