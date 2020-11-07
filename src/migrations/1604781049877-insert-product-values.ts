import {MigrationInterface, QueryRunner, getConnection} from "typeorm";
import { ProductEntity } from '../modules/product/product.entity';

export class insertProductValues1604781049877 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const connection = getConnection();
            await connection.createQueryBuilder().insert().into(ProductEntity).values([
            {
                name: 'Базовый',
                price: 36,
                duration: 90
            },

            {
                name: 'Оптимальный',
                price: 72,
                duration: 180
            },

            {
                name: 'Лидерский',
                price: 144,
                duration: 360
            }
        ]).execute()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
