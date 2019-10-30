import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column} from 'typeorm';
import { IsDate, IsInt } from 'class-validator';

import { PartnerEntity } from '../partner/partner.entity';

@Entity( {name: 'lead'} )
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
}