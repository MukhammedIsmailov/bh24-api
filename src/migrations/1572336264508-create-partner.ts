import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createPartner1572336264508 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'partner',
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
                    isNullable: false
                },
                {
                    name: 'second_name',
                    type: 'varchar',
                    isNullable: false
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
                    isNullable: false
                },
                {
                    name: 'password',
                    type: 'varchar',
                    isNullable: false
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
            ]
        }),true)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('partner');
    }
}
