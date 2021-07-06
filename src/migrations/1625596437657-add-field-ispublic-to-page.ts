import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFieldIspublicToPage1625596437657 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('page', new TableColumn({
            name: 'is_public',
            type: 'boolean',
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('page', 'is_public');
    }

}
