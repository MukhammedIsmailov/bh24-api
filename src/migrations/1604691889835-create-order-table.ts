import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn} from "typeorm";

export class createOrderTable1604691889835 implements MigrationInterface {
    name = 'createOrderTable1604691889835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'order',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'autorenewal',
                        type: 'boolean',
                        isNullable: false,
                    },
                    {
                        name: 'payed_at',
                        type: 'varchar',
                        isNullable: false,
                    },
                    /*{
                        name: 'user_id',
                        type: 'int',
                        isNullable: false
                    },
                    {
                        name: 'product_id',
                        type: 'int', 
                        isNullable: false
                    }*/
                ],
            }), true);

            await queryRunner.addColumn('order', new TableColumn({
                name: 'user_id',
                type: 'int'
            }));

            await queryRunner.addColumn('order', new TableColumn({
                name: 'product_id',
                type: 'int'
            }));

            await queryRunner.createForeignKey('order', new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE'
            }));

            await queryRunner.createForeignKey('order', new TableForeignKey({
                columnNames: ['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'product',
                onDelete: 'CASCADE'
            }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }

}
