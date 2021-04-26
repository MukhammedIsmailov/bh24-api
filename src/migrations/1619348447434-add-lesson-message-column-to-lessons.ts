import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addLessonMessageColumnToLessons1619348447434 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('lesson', new TableColumn({
            name: 'message',
            type: 'varchar',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('lesson', 'message');
    }

}
