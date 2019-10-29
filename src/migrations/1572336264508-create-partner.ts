import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createPartner1572336264508 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'partner',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true
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
                    isNullable: false
                },
                {
                    name: 'icon_url',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'phone_number',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isNullable: false
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
                    type: 'varchar'
                },
                {
                    name: 'telegram',
                    type: 'varchar'
                },
                {
                    name: 'skype',
                    type: 'varchar'
                },
                {
                    name: 'viber',
                    type: 'varchar'
                },
                {
                    name: 'question_who_are_you',
                    type: 'text'
                },
                {
                    name: 'question_why',
                    type: 'text'
                },
                {
                    name: 'question_value',
                    type: 'text'
                },
                {
                    name: 'question_staff',
                    type: 'text'
                },
                {
                    name: 'question_results',
                    type: 'text'
                },
            ]
        }),true)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("question");
    }
}
