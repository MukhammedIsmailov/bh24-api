import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { ContentEntity } from '../content/content.entity';

@Entity({ name: 'page' })
export class PageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'is_system' })
    isSystem: boolean;

    @Column({ name: 'verbose_name' })
    verboseName: string;

    @Column()
    name: string;

    @Column({ name: 'is_free' })
    isFree: boolean;

    @OneToMany(() => ContentEntity, content => content.page)
    content: ContentEntity[];
}
