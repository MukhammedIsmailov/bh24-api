import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFieldToPage1624201633767 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('page', new TableColumn({
            name: 'is_free',
            type: 'boolean',
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('page', 'is_free');
    }

}
