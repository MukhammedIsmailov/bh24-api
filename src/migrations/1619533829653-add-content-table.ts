import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class addContentTable1619533829653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'content',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'body',
                    type: 'varchar'
                },
                {
                    name: 'page_id',
                    type: 'int'
                }
            ]
        }));

        await queryRunner.createForeignKey('content', new TableForeignKey({
            columnNames: ['page_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'page',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('content');
    }

}
