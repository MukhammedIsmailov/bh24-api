import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createProductTable1604691864289 implements MigrationInterface {
    name = 'createProductTable1604691864289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'product',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'price',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'duration',
                    type: 'int',
                    isNullable: false,
                },
            ],
        }), true);
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('product');
    }

}
