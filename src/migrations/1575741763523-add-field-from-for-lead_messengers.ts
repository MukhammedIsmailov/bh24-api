import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFieldFromForLeadMessengers1575741763523 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('lead_messengers', new TableColumn({
            name: 'from',
            type: 'varchar',
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('lead_messengers', 'from');
    }
}
