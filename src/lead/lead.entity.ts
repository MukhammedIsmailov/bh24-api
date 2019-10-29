import { Entity , PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { PartnerEntity } from '../partner/partner.entity';

@Entity( {name: 'lead'} )
export class LeadEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => PartnerEntity, partner => partner.leads)
    @JoinColumn({ name: 'partner_id' })
    partner: PartnerEntity;
}