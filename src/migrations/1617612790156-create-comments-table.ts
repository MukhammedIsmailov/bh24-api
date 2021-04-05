import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn} from 'typeorm';

export class createCommentsTable1617612790156 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'comments',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'created_date',
                    type: 'timestamp'
                },
                {
                    name: 'text',
                    type: 'varchar'
                }
            ]
        }));

        await queryRunner.addColumn('comments', new TableColumn({
            name: 'user_id',
            type: 'int'
        }));

        await queryRunner.createForeignKey('comments', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));

        await queryRunner.addColumn('comments', new TableColumn({
            name: 'lesson_id',
            type: 'int'
        }));

        await queryRunner.createForeignKey('comments', new TableForeignKey({
            columnNames: ['lesson_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'lesson',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('comments');
    }

}
