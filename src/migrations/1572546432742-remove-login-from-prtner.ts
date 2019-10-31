import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class removeLoginFromPrtner1572546432742 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('partner', 'login');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('partner', new TableColumn({
            name: 'login',
            type: 'varchar',
            isUnique: true,
            isNullable: false
        }));
    }

}
