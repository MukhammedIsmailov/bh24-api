import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from 'typeorm';

export class addLeaderId1574620905414 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('partner', new TableColumn({
            name: 'leader_id',
            type: 'int',
            isNullable: true
        }));

        await queryRunner.createForeignKey('partner', new TableForeignKey({
            columnNames: ['leader_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'partner',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('partner');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('leader_id') !== -1);
        await queryRunner.dropForeignKey('partner', foreignKey);
        await queryRunner.dropColumn('partner', 'leader_id');
    }
}
