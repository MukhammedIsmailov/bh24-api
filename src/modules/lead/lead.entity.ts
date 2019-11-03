import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany } from 'typeorm';
import { IsDate, IsInt } from 'class-validator';

import { PartnerEntity } from '../partner/partner.entity';
import { LeadMessengersEntity } from '../leadMessengers/leadMessengers.entity';

@Entity({ name: 'lead' })
export class LeadEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'created_date' })
    @IsDate()
    createdDate: string;

    @Column()
    @IsInt()
    type: number;

    @ManyToOne(type => PartnerEntity, partner => partner.leads)
    @JoinColumn({ name: 'partner_id' })
    partner: PartnerEntity;

    @OneToMany(type => LeadMessengersEntity, messenger => messenger.lead)
    messengers: LeadMessengersEntity[];
}