import { MigrationInterface, QueryRunner } from 'typeorm';

export class createAdminUser1576787728342 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
       const user =  await queryRunner.query(`INSERT INTO "user" (first_name, second_name, refer_id, icon_url, phone_number, email, login, password, facebook, telegram, skype, viber, vk, whatsapp, question_who_are_you, question_why, question_value, question_staff, question_results, country, role, created_date, leader_id, note, status) VALUES ('BeHappy24', 'Admin', 'behappy24', '/icons/behappy24.jpg', '+123456789', 'admin@behappy24.com', 'behappy24', '$2b$10$6mY0cPUfDCxcO6omMFjp4uDr61JOVFzFQUBz4Gm/l7d3uJbxsvm.m', null, null, null, null, null, null, 'tmp', 'tmp', 'tmp', 'tmp', 'tmp', 'ru', 'admin', NOW(), null , null, null);`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
