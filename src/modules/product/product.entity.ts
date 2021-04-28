import { Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn, Column } from 'typeorm';
import { OrderEntity } from '../order/order.entity';
import { duration } from 'moment';

@Entity({ name: 'product' })
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @OneToMany(() => OrderEntity, order => order.product)
    orders: OrderEntity[];

    @Column()
    duration: number;

    @Column()
    description: string;
}
