import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {IsDate, IsInt, IsPositive} from 'class-validator';

import { LeadEntity } from '../lead/lead.entity';

@Entity({ name: 'lead_messengers' })
export class LeadMessengersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'telegram_info', default: null })
    telegramInfo: string;

    @Column({ name: 'facebook_info', default: null })
    facebookInfo: string;

    @Column({ name: 'viber_info', default: null })
    viberInfo: string;

    @IsInt()
    @IsPositive()
    @Column({ name: 'step' })
    step: number;

    @Column({ name: 'last_send_time' })
    @IsDate()
    lastSendTime: string;

    @ManyToOne(type => LeadEntity, lead => lead.messengers)
    @JoinColumn({ name: 'lead_id' })
    lead: LeadEntity;
}