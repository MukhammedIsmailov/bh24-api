import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}