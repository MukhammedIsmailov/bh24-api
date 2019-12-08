import { getManager } from 'typeorm';
import { sign } from 'jsonwebtoken';

import { UserEntity } from './user.entity';
import { createValidator, loginValidator, updateValidator } from './user.validator';
import { comparePasswords, getEncryptedPassword } from './user.service';
import { trackEventLog } from '../event/event.service';
import { EventLogs } from '../../lib/eventLogs';
import { ICreatePartner } from './DTO/ICreatePartner';
import { IUpdatePartner } from './DTO/IUpdatePartner';
import { IAuthorizePartner } from './DTO/IAuthorizePartner';
import { ICreateLead } from './DTO/ICreateLead';
import { IUpdateWard  } from './DTO/IUpdateWard';
import { IReadWard  } from './DTO/IReadWard';
import { getConfig } from '../../config';
import { createNewLeadMessengerItem } from '../leadMessengers/leadMessenger.sevice';

export class UserController {
    static async partnerRead (ctx, next) {
        try {
            const id = !!ctx.request.query.id ? Number.parseInt(ctx.request.query.id) : null;
            const referId = !!ctx.request.query.referId ? ctx.request.query.referId : null;

            if (!!id || !!referId) {
                const queryParams = !!id ? { id } : { referId };

                const userRepository = getManager().getRepository(UserEntity);

                const partner = await userRepository.findOne(queryParams);
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

    static async partnerCreate (ctx, next) {
        try {
            const data: ICreatePartner = ctx.request.body;
            const userId: number = parseInt(ctx.request.query.id);
            const userRepository = getManager().getRepository(UserEntity);
            const partner = await userRepository.findOne({ id: userId });
            if (!!partner) {
                const wrongFields = await createValidator(data, userRepository);
                if (wrongFields.length === 0) {
                    const leader = await userRepository.findOne({ id: data.leaderId });
                    const { leaderId, ...payloadData } = data;

                    await userRepository.update(userId, { ...payloadData, role: 'partner' });

                    await trackEventLog(EventLogs.newPartner, { id: partner.id }, leader);

                    const createdPartner = await userRepository.findOne({ id: userId });

                    const { note, status, country, role,  ...responseData } = createdPartner;

                    ctx.response.body = responseData;
                    ctx.status = 200;
                } else {
                    ctx.status = 400;
                    ctx.response.body = wrongFields;
                }
            } else {
                ctx.status = 404;
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
                const partner = await userRepository.findOne( { login: data.login });
                if (partner) {
                    if (comparePasswords(partner.password, data.password)) {
                        const config = getConfig();
                        const token = sign({id: partner.id }, config.jwtSecretKey, {
                            expiresIn: config.jwtTokenExpireInMinutes
                        });
                        ctx.response.body = { token };
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

            const messengerSubquery = !!data.messengerFilter ? ` AND "from" = '${data.messengerFilter}'` : '';
            const lessonSubquery = !!data.lessonFilter ? ` AND step = ${data.lessonFilter}` : '';
            const statusSubquery = !!data.statusFilter ? ` AND status = '${data.statusFilter}'`: '';
            const dateSubquery = !!data.startDateFilter && !!data.endDateFilter ?
                ` AND created_date > '${data.startDateFilter}' AND created_date < '${data.endDateFilter}'` : '';

            const query = `SELECT "user".id, first_name, second_name, icon_url, country, note, status, "from", step, 
                           "user".created_date, phone_number, last_send_time FROM "user" LEFT JOIN lead_messengers ON 
                           "user".id = lead_messengers.user_id WHERE leader_id = 1 ${messengerSubquery + lessonSubquery
                           + statusSubquery + dateSubquery};`;

            const result = await getManager().query(query);
            console.log(result);
            ctx.response.body = result;
            ctx.status = 200;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }
}