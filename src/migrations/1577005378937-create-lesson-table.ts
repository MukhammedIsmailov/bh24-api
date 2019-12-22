import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class createLessonTable1577005378937 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'lesson',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'lesson_id',
                    type: 'int',
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'body',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'video',
                    type: 'varchar',
                    isNullable: true,
                }
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
            await queryRunner.dropTable('lesson');
    }
}

