import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from 'typeorm';

import { LeadEntity } from "../lead/lead.entity";

@Entity({ name: 'partner' })
export class PartnerEntity {
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

    @OneToMany(type => LeadEntity, lead => lead.partner)
    leads: LeadEntity[];

    @ManyToOne(type => PartnerEntity, partner => partner.partners)
    @JoinColumn({ name: 'leader_id' })
    leader: PartnerEntity;

    @OneToMany(type => PartnerEntity, partner => partner.leader)
    partners: PartnerEntity[];
}