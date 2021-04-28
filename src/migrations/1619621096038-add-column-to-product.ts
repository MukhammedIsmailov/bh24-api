import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnToProduct1619621096038 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('product', new TableColumn({
            name: 'description',
            type: 'varchar',
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('product', 'description');
    }

}
