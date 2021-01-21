import {MigrationInterface, QueryRunner, getConnection} from "typeorm";
import { ProductEntity } from '../modules/product/product.entity';

export class insertProductValues1604781049877 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "product"("name", "price", "duration") VALUES ('Базовый', 3600, 90), ('Оптимальный', 7200, 180), ('Лидерский', 14400, 180)  RETURNING "id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
        await connection.createQueryBuilder().delete().from(ProductEntity)
    }

}
