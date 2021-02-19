import {getManager, Between, In} from 'typeorm';
import {sign} from 'jsonwebtoken';
import * as moment from 'moment';
import { v4 } from 'uuid';

import {UserEntity} from './user.entity';
import {createValidator, loginValidator, updateValidator} from './user.validator';
import {comparePasswords, getEncryptedPassword, getSubquery} from './user.service';
import {trackEventLog} from '../event/event.service';
import {EventLogs} from '../../lib/eventLogs';
import {ICreatePartner} from './DTO/ICreatePartner';
import {IUpdatePartner} from './DTO/IUpdatePartner';
import {IAuthorizePartner} from './DTO/IAuthorizePartner';
import {ICreateLead} from './DTO/ICreateLead';
import {IUpdateWard} from './DTO/IUpdateWard';
import {IReadWard} from './DTO/IReadWard';
import {IReadLeads} from './DTO/IReadLeads';
import {IPasswordResetQuery} from './DTO/IPasswordResetQuery';
import {getConfig} from '../../config';
import {createNewLeadMessengerItem} from '../leadMessengers/leadMessenger.sevice';
import {updateNotification} from '../notification/notification.service';
import { Messenger } from '../leadMessengers/DTO/IMessengerInfo';
import { hashSync } from 'bcrypt';
import { IPasswordReset } from './DTO/IPasswordReset';
import {emailTemplateReset} from "../mail/email-template";
import {createLessonEventTable1575742766492} from "../../migrations/1575742766492-create-lesson_event-table";

const saltRaunds = 10;

export class UserController {
    static async me (ctx, next) {
        try {
            const userRepository = getManager().getRepository(UserEntity);
            const id = ctx.currentParnter.id;
            const query = `SELECT
                               "user".first_name   AS "firstName",
                               "user".second_name  AS "secondName",
                               "user".login,
                               "user".icon_url     AS "iconUrl",
                               "user".leader_id,
                               "user".subscription_end,
                               "user".subscription_name,
                               leader.first_name   AS "leaderFirstName",
                               leader.second_name  AS "leaderSecondName",
                               leader.icon_url     AS "leaderIconUrl",
                               leader.login        AS "leaderLogin",
                               leader.phone_number AS "leaderPhoneNumber",
                               leader.email        AS "leaderEmail",
                               leader.facebook,
                               leader.telegram,
                               leader.skype,
                               leader.vk,
                               leader.viber,
                               leader.whatsapp
                            FROM "user"
                                LEFT JOIN "user" AS leader on "user".leader_id = leader."id"
                            WHERE "user".id = ${id};`;
            const user = await userRepository.query(query);
            ctx.body = user[0];
            ctx.status = 200;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
        await next();
    }

    static async partnerReadById (ctx, next) {
        try {
            const id = !!ctx.request.query.id ? Number.parseInt(ctx.request.query.id) : null;

            if (!!id) {
                const userRepository = getManager().getRepository(UserEntity);
                const partner = await userRepository.findOne({ where: { id: id }});
                if (!!partner) {
                    const { note, status, country, role,  ...payloadData } = partner;
                    payloadData.password = payloadData.password !== null ? '*******' : null;
                    ctx.response.body = payloadData;
                    ctx.status = 200;
                } else {
                    ctx.status = 404;
                }
            } else {
                ctx.status = 400;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }

    static async partnerReadByReferId (ctx, next) {
        try {
            const referId = ctx.request.query.referId;

            if (!!referId) {
                const userRepository = getManager().getRepository(UserEntity);

                const partner = await userRepository.findOne({ where: { referId: referId },
                    select: ['iconUrl', 'firstName', 'secondName', 'id', 'questionWhoAreYou', 'questionWhy',
                    'questionValue', 'questionStaff', 'questionResults'] });
                if (!!partner) {
                    ctx.response.body = partner;
                    ctx.status = 200;
                } else {
                    ctx.status = 404;
                }
            } else {
                ctx.status = 400;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }

    static async partnerCreate (ctx, next) {
        try {
            const data: ICreatePartner = ctx.request.body;
            const userRepository = getManager().getRepository(UserEntity);
            const wrongFields = await createValidator(data, userRepository);
            if (wrongFields.length === 0) {
                const leader = await userRepository.findOne({ id: data.leaderId });

                const newPartner = await userRepository.create({
                    ...data, createdDate: new Date().toISOString(), role: 'partner', leader: leader, country: data.country,
                });
                const createdPartner = await userRepository.save(newPartner);

                const { note, status, country, role,   ...responseData } = createdPartner;

                ctx.response.body = responseData;
                ctx.status = 200;
            } else {
                ctx.status = 400;
                ctx.response.body = wrongFields;
            }
        } catch (e) {
            ctx.status = 500;
            ctx.response.body = e.message;
        }

        next();
    }

    static async partnerUpdate (ctx, next) {
        try {
            const data: IUpdatePartner = ctx.request.body;
            const id = Number.parseInt(ctx.request.query.id);

            const userRepository = getManager().getRepository(UserEntity);

            const partner = await userRepository.findOne({ id: id });
            if (!!partner) {
                const wrongFields = await updateValidator(id, data, userRepository);
                if (wrongFields.length === 0) {
                    if (!!data.password) {
                        data.password = getEncryptedPassword(data.password);
                    }
                    await userRepository.update(id, data);
                    const updatedPartner = await userRepository.findOne({ id: id });

                    const { note, status, country, role,  ...responseData } = updatedPartner;
                    responseData.password = responseData.password !== null ? '*******' : null;

                    ctx.response.body = responseData;
                    ctx.status = 200;
                } else {
                    ctx.response.body = wrongFields;
                    ctx.status = 400;
                }
            } else {
                ctx.status = 404;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }

    static async authorize (ctx, next) {
        try {
            const data: IAuthorizePartner = ctx.request.body;

            const userRepository = getManager().getRepository(UserEntity);

            const wrongFields = loginValidator(data);

            if (wrongFields.length === 0) {
                const partner = await userRepository.findOne( {
                    where: [
                        { login: data.login },
                        { email: data.login }
                    ]
                });
                if (partner) {
                    if (comparePasswords(partner.password, data.password) && !partner.resetPasswordHash) {
                        const config = getConfig();
                        const token = sign({id: partner.id }, config.jwtSecretKey, {
                            expiresIn: config.jwtTokenExpireInMinutes
                        });
                        ctx.response.body = { token, userId: partner.id, referId: partner.referId };
                        return ctx.status = 200;
                    }
                } else {
                    ctx.status = 404;
                }
            } else {
                ctx.status = 400;
                ctx.response.body = wrongFields;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }

    static async resetPasswordQuery (ctx, next) {
        try {
            console.log(ctx)
            const data: IPasswordResetQuery = ctx.request.body;
            const { email } = data;
            const userRepository = getManager().getRepository(UserEntity);

            const user = await userRepository.findOne({ where: { email, } })
            if (!!user) {
                user.resetPasswordHash = v4();
                await userRepository.save(user);
                ctx.queue.add('mail', { email: user.email, subject: process.env.EMAIL_SUBJECT, text: emailTemplateReset(user.resetPasswordHash) });
                ctx.response.body = { message: 'Password recovery link was successfully sent to your email.' };

                ctx.status = 200;
            } else {
                ctx.status = 404;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }

    static async resetPassword (ctx, next){
        try {
            const data: IPasswordReset = ctx.request.body;
            const { newPassword, resetPasswordHash } = data;
            const userRepository = getManager().getRepository(UserEntity);
            const user = await userRepository.findOne({ where: { resetPasswordHash } });
            if (!!user){
                user.password = hashSync(newPassword, saltRaunds);
                user.resetPasswordHash = null;
                await userRepository.save(user);
                ctx.response.body = { message: 'Password was successfully changed.' };
                ctx.status = 200;
            } else {
                ctx.status = 404;
            }

        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }

    static async leadCreate (ctx, next) {
        try {
            const data: ICreateLead = ctx.request.body;

            if (!!data.referId) {
                const userRepository = getManager().getRepository(UserEntity);

                const leader = await userRepository.findOne({ where: { referId: data.referId } });
                if (!!leader){
                    const newLead = await userRepository.create({
                        role: 'lead',
                        firstName: !!data.messengerInfo.first_name ? data.messengerInfo.first_name : data.messengerInfo.username,
                        secondName: !!data.messengerInfo.second_name ? data.messengerInfo.second_name : data.messengerInfo.messenger,
                        country: data.country,
                        createdDate: new Date().toISOString(),
                        leader: leader
                    });
                    const savedLead = await userRepository.save(newLead);
                    await createNewLeadMessengerItem(data, savedLead);
                    await trackEventLog(EventLogs.courseSubscription, null, leader);
                        ctx.response.body = {
                            id: savedLead.id,
                        };
                        ctx.status = 200;
                    } else {
                        ctx.status = 404;
                    }
            }

        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
        
        next();
    }

    static async wardUpdate (ctx, next) {
        try {
            const data: IUpdateWard = ctx.request.body;
            const id = Number.parseInt(ctx.request.query.id);
            const leaderId = ctx.currentParnter.id;
            if (!!data.note || !!data.status) {
                const userRepository = getManager().getRepository(UserEntity);

                const partner = await userRepository.findOne({ id: id });
                const leader = await userRepository.findOne({ id: leaderId });
                if (!!partner) {
                    if(data.status === 'partner') {
                        data.role = 'partner';
                        if(partner.role !== data.role) {
                            await trackEventLog(EventLogs.newPartner, null, leader);
                        }
                    }
                    if(data.status === 'client') {
                        data.role = 'client';
                        if(partner.role !== data.role) {
                            await trackEventLog(EventLogs.newClient, null, leader);
                        }
                    }
                    await userRepository.update(id, data);
                    const updatedWard = await userRepository.findOne({ id: id },
                        { select: ['id', 'status', 'note'] });
                    await updateNotification(id);
                    ctx.response.body =  updatedWard;
                    ctx.status = 200;
                } else {
                    ctx.status = 404;
                }
            } else {
                ctx.status = 400;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }

    static async wardRead (ctx, next) {
        try {
            const data: IReadWard = ctx.request.body;

            const psqlDateFormat = 'YYYY-MM-DD HH:mm:ss';

            const endDateTime = moment.unix(parseInt(data.endDateFilter, 10)).utc();
            const startDateTime = moment.unix(parseInt(data.startDateFilter, 10)).utc();
            const userRepository = getManager().getRepository(UserEntity);

            let statuses: Array<string> = [];
            if (data.partnerFilter) statuses.push('partner');
            if (data.clientFilter) statuses.push('client');
            if (data.renouncementFilter) statuses.push('renouncement');
            if (data.contactFilter) statuses.push('contact');

            const leader = await userRepository.findOne(ctx.currentParnter);
            const dataFromDB = await userRepository.find({
                select: ['id', 'firstName', 'secondName', 'iconUrl', 'country', 'note', 'status', 'createdDate', 'phoneNumber'],
                where: { leader,  createdDate: Between(startDateTime, endDateTime), status: In(statuses) },
                relations: ['messengers', 'lessonEvents', 'leadEvents', 'leadNotifications']
            });

            const users = dataFromDB
                .filter(item =>
                    !!(+data.lessonFilter < 4 && item.lessonEvents
                        .find(item => item.lessonNumber == +data.lessonFilter && item.readingDate) ||
                        item.lessonEvents.every(item => item.readingDate) || data.lessonFilter === "any") &&
                    //TODO: edit where facebook will added
                    data.telegramFilter &&
                    ( data.contactsSeeFilter ? item.leadEvents.filter(el => el.eventLog === 'CS').length > 0 : true ) &&
                    ( data.feedbackFilter ? item.leadEvents.find(el => el.eventLog === 'FB') : true ) &&
                    ( data.searchFilter ? ( item.firstName + ' ' + item.secondName ).includes(data.searchFilter) : true )
                )
                .map(item => ({
                    id: item.id,
                    first_name: item.firstName,
                    second_name: item.secondName,
                    icon_url: item.iconUrl,
                    country: item.country,
                    note: item.note,
                    status: item.status,
                    created_date: item.createdDate,
                    phone_number: item.phoneNumber || null,
                    username: item.messengers[0].username,
                    from: item.messengers[0].from,
                    active: !!item.leadNotifications.find(el => el.deletedDate === null && el.updatedDate === null),
                    step: Math.max.apply(Math, item.lessonEvents.map(item => item.lessonNumber) as Array<number>),
                    contacts: item.leadEvents.filter(el => el.eventLog === 'CS').length,
                    feedback: item.leadEvents.find(el => el.eventLog === 'FB') ? 1 : null,
                    last_send_time: item.messengers[0].lastSendTime
                })
            );


            ctx.response.body = users;
            ctx.status = 200;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }

    static async leadsRead (ctx, next) {
        try {
            const leaderId = ctx.currentParnter.id;

            const query = `SELECT "user".first_name, "user".second_name, "user".id, "leader".refer_id 
                              FROM "user" AS leader 
                              INNER JOIN "user" AS "user" ON "leader".id = "user".leader_id 
                           WHERE leader.id = ${leaderId} AND "user".role = 'lead';`;

            const leadsData = await getManager().query(query);
            const leads: IReadLeads[] = leadsData.map(lead => {
                return {
                    fullName: `${lead.second_name} ${lead.first_name}`,
                    urlForCreate: `?referId=${lead.refer_id}&userId=${lead.id}`,
                }
            });

            ctx.response.body = leads;
        } catch (e) {
            ctx.status = 500;
            console.log(e);
        }
        next();
    }

    static async leaderReadByUserId (ctx, next) {
        try {
            const userId = parseInt(ctx.request.query.userId);
            if (!!userId) {
                const query = `SELECT "user".leader_id    AS "leaderId",
                               leader.first_name   AS "firstName",
                               leader.second_name  AS "secondName",
                               leader.email,
                               leader.phone_number AS "phoneNumber",
                               leader.telegram,
                               leader.facebook,
                               leader.viber,
                               leader.vk,
                               leader.whatsapp,
                               leader.skype,
                               leader.icon_url     AS "iconUrl",
                               leader.login,
                               leader.question_who_are_you as "leaderDescription"
                        FROM "user"
                        INNER JOIN "user" AS leader ON "user".leader_id = leader.id
                        WHERE "user".id = ${userId};`;
                const leader = await getManager().query(query);
                ctx.response.body = leader[0];
                ctx.status = 200;
            } else {
                ctx.status = 400;
            }
        } catch (e) {
           console.log(e);
           ctx.status = 500;
        }
        next();
    }
}