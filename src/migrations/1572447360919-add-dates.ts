import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addDates1572447360919 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('partner', new TableColumn({
            name: 'created_date',
            type: 'timestamp'
        }));
        await queryRunner.addColumn('lead', new TableColumn({
            name: 'created_date',
            type: 'timestamp'
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('partner', 'create_date');
        await queryRunner.dropColumn('lead', 'create_date');
    }
}
