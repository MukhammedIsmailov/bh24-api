import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {CommentEntity} from "../comments/comment.entity";

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

    @OneToMany(() => CommentEntity, comment => comment.lesson)
    comments: CommentEntity[];
}
