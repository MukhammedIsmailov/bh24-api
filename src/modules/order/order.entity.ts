import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'order' })
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => ProductEntity, product => product.orders)
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;

    @Column()
    autorenewal: boolean;

    @Column()
    payed_at: string;
}