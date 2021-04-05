import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {CommentsEntity} from "../comments/comments.entity";

@Entity({ name: 'lesson' })
export class LessonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'lesson_id' })
    lessonId: number;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column()
    video: string;

    @OneToMany(() => CommentsEntity, comment => comment.lesson)
    comments: CommentsEntity[];
}
