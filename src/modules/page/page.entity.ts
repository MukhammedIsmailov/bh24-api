import { Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn, Column } from 'typeorm';
import { OrderEntity } from '../order/order.entity';

@Entity({ name: 'product' })
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('varchar',{ array: true })
    content: string[];
}
