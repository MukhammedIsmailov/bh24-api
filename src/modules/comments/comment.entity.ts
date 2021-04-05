import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { LessonEntity } from '../lesson/lesson.entity';

@Entity({ name: 'comments' })
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'created_date' })
    createdDate: string;

    @ManyToOne(type => UserEntity, user => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(type => LessonEntity, lesson => lesson.comments)
    @JoinColumn({ name: 'lesson_id' })
    lesson: LessonEntity

    @Column()
    text: string;
}
