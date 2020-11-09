import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class addColumnUser1604943337174 implements MigrationInterface {
    name = 'addColumnUser1604943337174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('user', new TableColumn({
            name: 'subscription_end',
            type: 'varchar',
            isNullable: true,
        }));

        await queryRunner.addColumn('user', new TableColumn({
            name: 'subscription_name',
            type: 'varchar',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'subscription_end');
        await queryRunner.dropColumn('user', 'subscription_name');
    }

}
