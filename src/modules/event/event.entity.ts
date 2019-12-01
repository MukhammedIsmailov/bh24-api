import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { PartnerEntity } from '../partner/partner.entity';

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

    @ManyToOne(type => PartnerEntity, partner => partner.events)
    @JoinColumn({ name: 'partner_id' })
    partner: PartnerEntity;
}