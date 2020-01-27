import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { LeadMessengersEntity } from '../leadMessengers/leadMessengers.entity';

@Entity({ name: 'notification' })
export class NotificationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'created_date' })
    createdDate: string;

    @Column({ name: 'updated_date' })
    updatedDate: string;

    @Column({ name: 'deleted_date' })
    deletedDate: string;

    @ManyToOne(type => UserEntity, user => user.leadNotifications)
    @JoinColumn({ name: 'lead_id' })
    lead: UserEntity;

    @ManyToOne(type => UserEntity, user => user.leaderNotifications)
    @JoinColumn({ name: 'leader_id' })
    leader: UserEntity;

    @ManyToOne(type => LeadMessengersEntity, messenger => messenger.notifications)
    @JoinColumn({ name: 'messenger_id' })
    messenger: LeadMessengersEntity;
}