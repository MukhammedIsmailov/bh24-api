import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from '../user/user.entity';

@Entity({ name: 'event' })
export class EventEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'event_log' })
    eventLog: string;

    @Column({ name: 'created_date' })
    createdDate: string;

    @Column({ name: 'payload_data' })
    payloadData: string;

    @ManyToOne(type => UserEntity, user => user.events)
    @JoinColumn({ name: 'lead_id' })
    lead: UserEntity;

    @ManyToOne(type => UserEntity, user => user.events)
    @JoinColumn({ name: 'leader_id' })
    leader: UserEntity;
}