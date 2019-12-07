import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from '../user/user.entity';

@Entity({ name: 'lesson_event' })
export class LessonEventEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'lesson_number' })
    lessonNumber: number;

    @Column({ name: 'created_date' })
    createdDate: string;

    @Column({ name: 'reading_date' })
    readingDate: string;

    @ManyToOne(type => UserEntity, user => user.lessonEvents)
    @JoinColumn({ name: 'lead_id' })
    lead: UserEntity;
}