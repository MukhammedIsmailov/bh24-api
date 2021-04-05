import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import { EventEntity } from '../event/event.entity';
import { LeadMessengersEntity } from '../leadMessengers/leadMessengers.entity';
import { LessonEventEntity } from '../lessonEvent/lessonEvent.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { OrderEntity } from '../order/order.entity';
import { CommentsEntity } from '../comments/comments.entity';

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'second_name' })
    secondName: string;

    @Column({ name: 'refer_id' })
    referId: string;

    @Column({ name: 'icon_url' })
    iconUrl: string;

    @Column({ name: 'phone_number' })
    phoneNumber: string;

    @Column()
    email: string;

    @Column()
    login: string;

    @Column()
    password: string;

    @Column()
    facebook: string;

    @Column()
    telegram: string;

    @Column()
    skype: string;

    @Column()
    viber: string;

    @Column()
    vk: string;

    @Column()
    whatsapp: string;

    @Column({ name: 'question_who_are_you', type: 'text' })
    questionWhoAreYou: string;

    @Column({ name: 'question_why', type: 'text' })
    questionWhy: string;

    @Column({ name: 'question_value', type: 'text' })
    questionValue: string;

    @Column({ name: 'question_staff', type: 'text' })
    questionStaff: string;

    @Column({ name: 'question_results' })
    questionResults: string;

    @Column({ name: 'created_date' })
    createdDate: string;

    @Column()
    country: string;

    @Column()
    role: string;

    @OneToMany(type => UserEntity, user => user.leader)
    users: UserEntity[];

    @ManyToOne(type => UserEntity, user => user.users)
    @JoinColumn({ name: 'leader_id' })
    leader: UserEntity;

    @OneToMany(type => EventEntity, event => event.leader)
    events: EventEntity[];

    @OneToMany(type => EventEntity, event => event.lead)
    leadEvents: EventEntity[];

    @OneToMany(type => LeadMessengersEntity, leadMessengers => leadMessengers.user)
    messengers: LeadMessengersEntity[];

    @OneToMany(type => LessonEventEntity, lessonEvents => lessonEvents.lead)
    lessonEvents: LessonEventEntity[];

    @Column()
    note: string;

    @Column()
    status: string;

    @OneToMany(type => NotificationEntity, notifications => notifications.lead)
    leadNotifications: NotificationEntity[];

    @OneToMany(type => NotificationEntity, notifications => notifications.leader)
    leaderNotifications: NotificationEntity[];

    @OneToMany(() => OrderEntity, order => order.user)
    orders: OrderEntity[];

    @OneToMany(() => CommentsEntity, comment => comment.user)
    comments: CommentsEntity[];

    @Column()
    subscription_end: string;

    @Column()
    subscription_name: string;

    @Column({ name: 'reset_password_hash' })
    resetPasswordHash: string;
}
