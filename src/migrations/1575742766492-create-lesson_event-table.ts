import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class createLessonEventTable1575742766492 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'lesson_event',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'lesson_number',
                    type: 'int',
                },
                {
                    name: 'created_date',
                    type: 'timestamp',
                },
                {
                    name: 'reading_date',
                    type: 'timestamp',
                    isNullable: true,
                },
            ],
        }), true);

        await queryRunner.addColumn('lesson_event', new TableColumn({
            name: 'lead_id',
            type: 'int'
        }));

        await queryRunner.createForeignKey('lesson_event', new TableForeignKey({
            columnNames: ['lead_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('lesson_event');
    }
}
