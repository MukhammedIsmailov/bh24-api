import { getManager } from 'typeorm';
import { sign } from 'jsonwebtoken';
import * as moment from 'moment';

import { UserEntity } from './user.entity';
import { createValidator, loginValidator, updateValidator } from './user.validator';
import { comparePasswords, getEncryptedPassword, getCountryCode } from './user.service';
import { trackEventLog } from '../event/event.service';
import { EventLogs } from '../../lib/eventLogs';
import { ICreatePartner } from './DTO/ICreatePartner';
import { IUpdatePartner } from './DTO/IUpdatePartner';
import { IAuthorizePartner } from './DTO/IAuthorizePartner';
import { ICreateLead } from './DTO/ICreateLead';
import { IUpdateWard  } from './DTO/IUpdateWard';
import { IReadWard  } from './DTO/IReadWard';
import { IReadLeads  } from './DTO/IReadLeads';
import { getConfig } from '../../config';
import { createNewLeadMessengerItem } from '../leadMessengers/leadMessenger.sevice';

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
            console.log(data)
            const userRepository = getManager().getRepository(UserEntity);
            const wrongFields = await createValidator(data, userRepository);
            if (wrongFields.length === 0) {
                const leader = await userRepository.findOne({ id: data.leaderId });

                const newPartner = await userRepository.create({
                    ...data, createdDate: new Date().toISOString(), role: 'partner', leader: leader, country: getCountryCode(data.ip),
                });
                const createdPartner = await userRepository.save(newPartner);
                await trackEventLog(EventLogs.newPartner, null, leader);

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
                    if (comparePasswords(partner.password, data.password)) {
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
                    await trackEventLog(EventLogs.newLead, null, leader);
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
            if (!!data.note || !!data.status) {
                const userRepository = getManager().getRepository(UserEntity);

                const partner = await userRepository.findOne({ id: id });
                if (!!partner) {
                    data.role = data.status === 'partner' ? 'partner' : partner.role;
                    await userRepository.update(id, data);
                    const updatedWard = await userRepository.findOne({ id: id },
                        { select: ['id', 'status', 'note'] });
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
            const leaderId = ctx.currentParnter.id;

            const psqlDateFormat = 'YYYY-MM-DD HH:mm:ss';

            const endDateTime = moment.unix(parseInt(data.endDateFilter, 10)).utc();
            const startDateTime = moment.unix(parseInt(data.startDateFilter, 10)).utc();

            const startDate = startDateTime.format(psqlDateFormat);
            const endDate = endDateTime.format(psqlDateFormat);

            const messengerSubquery = !!data.messengerFilter && data.messengerFilter !== "null" ? ` AND "from" = '${data.messengerFilter}'` : '';
            const lessonSubquery = !!data.lessonFilter && data.lessonFilter !== "null" ? ` AND step = ${data.lessonFilter}` : '';
            const statusSubquery = !!data.statusFilter  && data.statusFilter !== "null" ? ` AND status = '${data.statusFilter}'`: '';
            const dateSubquery = ` AND "user".created_date > '${startDate}' AND "user".created_date < '${endDate}'`;
            const leadSubquery = data.leadFilter === false ? ` AND role != 'lead'` : '';
            const partnerSubquery = data.partnerFilter === false ? ` AND role != 'partner'` : '';
            const feedbackSubquery = data.feedbackFilter === false ? ` AND feedback > 0` : '';
            const contactsSubquery = data.contactsFilter === false ? ` AND contacts > 0` : '';
            const lessonFinishSubquery = data.lessonFinishFilter === false ? ` AND max_lesson_number != 4` : '';
            const searchSubquery = !!data.searchFilter ? ` AND (position(LOWER(first_name) in '${data.searchFilter.toLocaleLowerCase()}') > 0
                                                           OR  (position(LOWER(second_name) in '${data.searchFilter.toLocaleLowerCase()}') > 0
                                                           OR  (position(LOWER(login) in '${data.searchFilter.toLocaleLowerCase()}') > 0)))` : '';

            const query = `SELECT DISTINCT "user".id, first_name, second_name, icon_url, country, note, status, "from", step,
                                  "user".created_date, phone_number, last_send_time, username, feedback, contacts, max_lesson_number
                            FROM "user"
                                LEFT JOIN lead_messengers ON "user".id = lead_messengers.user_id
                                LEFT JOIN event ON "user".id = event.lead_id
                                LEFT JOIN (SELECT count(CASE WHEN event_log = '${EventLogs.feedbackButtonClick}' THEN 1 ELSE NULL END) AS feedback, 
                                                  count(CASE WHEN event_log = '${EventLogs.contactsSee}' THEN 1 ELSE NULL END) AS contacts, event.lead_id
                                            FROM event WHERE event.leader_id = ${leaderId}
                                            GROUP BY event.lead_id) AS eventCount ON "user".id = eventCount.lead_id
                                LEFT JOIN (SELECT max(lesson_number) AS max_lesson_number, lesson_event.lead_id 
                                            FROM lesson_event 
                                            GROUP BY lesson_event.lead_id) AS lessonEvent ON "user".id = lessonEvent.lead_id                                            
                            WHERE "user".leader_id = ${leaderId + messengerSubquery + lessonSubquery
                                                + statusSubquery + dateSubquery + leadSubquery + partnerSubquery + 
                                                  searchSubquery + feedbackSubquery + contactsSubquery + lessonFinishSubquery}`;

            const result = await getManager().query(query);
            ctx.response.body = result;
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