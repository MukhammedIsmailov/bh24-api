import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class createUserTable1575473543975 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'user',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'first_name',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'second_name',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'refer_id',
                    type: 'varchar',
                    isUnique: true,
                    isNullable: true
                },
                {
                    name: 'icon_url',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'phone_number',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'login',
                    type: 'varchar',
                    isUnique: true,
                    isNullable: true
                },
                {
                    name: 'password',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'facebook',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'telegram',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'skype',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'viber',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'vk',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'whatsapp',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'question_who_are_you',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'question_why',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'question_value',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'question_staff',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'question_results',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'country',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'role',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'created_date',
                    type: 'timestamp',
                    isNullable: true
                },
                {
                    name: 'subscription_end',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'subscription_name',
                    type: 'varchar',
                    isNullable: true
                }
            ]
        }),true);

        await queryRunner.addColumn('user', new TableColumn({
            name: 'leader_id',
            type: 'int',
            isNullable: true
        }));

        await queryRunner.createForeignKey('user', new TableForeignKey({
            columnNames: ['leader_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user');
    }
}
