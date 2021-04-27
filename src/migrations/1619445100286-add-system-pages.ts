import {MigrationInterface, QueryRunner} from "typeorm";

export class addSystemPages1619445100286 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const query = `INSERT INTO page (is_system, name, verbose_name) VALUES 
                       (true, 'main', 'Главная'),
                       (true, 'education', 'Обучение'),
                       (true, 'calendar', 'Календарь'),
                       (true, 'promo', 'Промо')`;
        await queryRunner.query(query);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM page WHERE name IN ('main', 'education', 'calendar', 'promo')`);
    }

}
