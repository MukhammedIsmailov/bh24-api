import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addLastSendTime1573210401073 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('lead_messengers', new TableColumn({
            name: 'last_send_time',
            type: 'timestamp'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('lead_messengers', 'last_send_time');
    }
}
