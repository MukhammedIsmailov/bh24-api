import { Entity , PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { IsString, IsUrl, IsEmail, IsDate } from 'class-validator';

import { LeadEntity } from "../lead/lead.entity";

@Entity( {name: 'partner'} )
export class PartnerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name' })
    @IsString()
    firstName: string;

    @Column({ name: 'second_name' })
    @IsString()
    secondName: string;

    @Column({ name: 'refer_id' })
    @IsString()
    referId: string;

    @Column({ name: 'icon_url' })
    @IsString()
    @IsUrl()
    iconUrl: string;

    @Column({ name: 'phone_number' })
    @IsString()
    phoneNumber: string;

    @Column()
    @IsString()
    @IsEmail()
    email: string;

    @Column()
    @IsString()
    password: string;

    @Column()
    @IsString()
    facebook: string;

    @Column()
    @IsString()
    telegram: string;

    @Column()
    @IsString()
    skype: string;

    @Column()
    @IsString()
    viber: string;

    @Column({ name: 'question_who_are_you', type: 'text' })
    @IsString()
    questionWhoAreYou: string;

    @Column({ name: 'question_why', type: 'text' })
    @IsString()
    questionWhy: string;

    @Column({ name: 'question_value', type: 'text' })
    @IsString()
    questionValue: string;

    @Column({ name: 'question_staff', type: 'text' })
    @IsString()
    questionStaff: string;

    @Column({ name: 'question_results' })
    @IsString()
    questionResults: string;

    @Column({ name: 'created_date' })
    @IsDate()
    createdDate: string;

    @OneToMany(type => LeadEntity, lead => lead.partner)
    leads: LeadEntity[]
}