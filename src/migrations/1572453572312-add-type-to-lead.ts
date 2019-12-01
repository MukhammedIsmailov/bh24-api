import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addTypeToLead1572453572312 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('lead', new TableColumn({
            name: 'type',
            type: 'int'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('lead', 'type');
    }
}
