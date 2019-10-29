import { Entity , PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
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

    @Column({ name: 'question_who_are_you' })
    questionWhoAreYou: string;

    @Column({ name: 'question_why' })
    questionWhy: string;

    @Column({ name: 'question_value' })
    questionValue: string;

    @Column({ name: 'question_staff' })
    questionStaff: string;

    @Column({ name: 'question_results' })
    questionResults: string;
}