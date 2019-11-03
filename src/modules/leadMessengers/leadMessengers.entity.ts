import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

    @ManyToOne(type => LeadEntity, lead => lead.messengers)
    @JoinColumn({ name: 'lead_id' })
    lead: LeadEntity;
}