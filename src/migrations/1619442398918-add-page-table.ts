import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class addPageTable1619442398918 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'page',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'is_system',
                    type: 'boolean'
                },
                {
                    name: 'name',
                    type: 'varchar'
                },
                {
                    name: 'verbose_name',
                    type: 'varchar'
                },
                {
                    name: 'content',
                    type: 'varchar[]'
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('page');
    }

}
