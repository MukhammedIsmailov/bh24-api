import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { NotificationEntity } from '../notification/notification.entity';

@Entity({ name: 'lead_messengers' })
export class LeadMessengersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'telegram_info', default: null })
    telegramInfo: string;

    @Column({ name: 'facebook_info', default: null })
    facebookInfo: string;

    @Column({ name: 'step' })
    step: number;

    @Column({ name: 'last_send_time' })
    lastSendTime: string;

    @Column({ name: 'from' })
    from: string;

    @Column()
    username: string;

    @ManyToOne(type => UserEntity, user => user.messengers)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @OneToMany(type => NotificationEntity, notifications => notifications.messenger)
    notifications: NotificationEntity[];
}