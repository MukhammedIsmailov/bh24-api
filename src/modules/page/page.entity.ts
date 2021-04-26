import { Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn, Column } from 'typeorm';
import { OrderEntity } from '../order/order.entity';

@Entity({ name: 'product' })
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'is_system' })
    isSystem: boolean;

    @Column({ name: 'verbose_name' })
    verboseName: string;

    @Column()
    name: string;

    @Column('varchar',{ array: true })
    content: string[];
}
