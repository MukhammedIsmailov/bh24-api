import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addUsernameForLeadMessengers1577262465317 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('lead_messengers', new TableColumn({
            name: 'username',
            type: 'varchar',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('lead_messengers', 'username');
    }
}
