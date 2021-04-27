import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { PageEntity } from '../page/page.entity';

@Entity({ name: 'content' })
export class ContentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    body: string;

    @ManyToOne(type => PageEntity, page => page.content)
    @JoinColumn({ name: 'page_id' })
    page: PageEntity;
}
