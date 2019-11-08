import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addStepToLeadMessengers1573207970691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('lead_messengers', new TableColumn({
            name: 'step',
            type: 'int'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('lead_messengers', 'step');
    }
}
