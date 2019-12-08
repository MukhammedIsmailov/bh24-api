import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFieldsNoteAndStatusForUser1575826531538 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('user', new TableColumn({
            name: 'note',
            type: 'text',
            isNullable: true,
        }));

        await queryRunner.addColumn('user', new TableColumn({
            name: 'status',
            type: 'varchar',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('user', 'note');
        await queryRunner.dropColumn('user', 'status');
    }
}
