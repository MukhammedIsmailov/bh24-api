import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class orderRefactoring1604944832865 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn('order', 'payed_at', new TableColumn({
            name: 'payed_at',
            type: 'varchar',
            isNullable: true,
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
