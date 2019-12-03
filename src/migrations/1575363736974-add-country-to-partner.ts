import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addCountryToPartner1575363736974 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('partner', new TableColumn({
            name: 'country',
            type: 'varchar',
            default: null,
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('partner', 'country');
    }
}
