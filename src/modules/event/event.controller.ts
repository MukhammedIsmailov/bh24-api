import { getManager } from 'typeorm';

import { ILandingVisitLog } from './DTO/ILandingVisitLog';
import { ICourseFinishedLog } from './DTO/ICourseFinishedLog';
import { UserEntity } from '../user/user.entity';
import { EventLogs } from '../../lib/eventLogs';
import { trackEventLog } from './event.service';
import { createNotification } from '../notification/notification.service';

export class EventController {
    static async landingVisitLogCreate (ctx, next) {
        const data: ILandingVisitLog = ctx.request.body;

        if (!!data.referId) {
            try {
                const userRepository = getManager().getRepository(UserEntity);

                const leader = await userRepository.findOne({where: { referId: data.referId }});

                if (!!leader) {
                    await trackEventLog(EventLogs.landingVisit, null, leader);
                    ctx.status = 200;
                } else {
                    ctx.status = 404;
                }
            } catch (e) {
                console.log(e);
                ctx.status = 500;
            }
        } else {
            ctx.status = 400;
        }
        next();
    }

    static async courseFinishedLogCreate (ctx, next) {
        const data: ICourseFinishedLog = ctx.request.body;

        if (!!data.userId) {
            try {
                const userRepository = getManager().getRepository(UserEntity);

                const user = await userRepository.findOne({where: { id: data.userId }, relations: ['leader']});

                if (!!user && !!user.leader) {
                    await trackEventLog(EventLogs.courseFinished, null, user.leader);
                    ctx.status = 200;
                } else {
                    ctx.status = 404;
                }
            } catch (e) {
                console.log(e);
                ctx.status = 500;
            }
        } else {
            ctx.status = 400;
        }
        next();
    }

    static async feedbackButtonClickLogCreate (ctx, next) {
        const data: ICourseFinishedLog = ctx.request.body;
        console.log(data)

        if (!!data.userId) {
            try {
                const userRepository = getManager().getRepository(UserEntity);

                const user = await userRepository.findOne({where: { id: data.userId }, relations: ['leader', 'messengers']});
                user.phoneNumber = data.phoneNumber;
                await userRepository.save(user);

                if (!!user && !!user.leader) {
                    const currentDate = new Date();

                    await createNotification(currentDate, user.leader, user, user.messengers[0]);

                    await trackEventLog(EventLogs.feedbackButtonClick, { userId: data.userId }, user.leader, user);
                        ctx.io.emit('feedbackClick', {
                            partnerId: user.leader.id,
                            firstName: user.firstName,
                            secondName: user.secondName,
                            date: currentDate.toISOString(),
                            username: user.messengers[0].username,
                            from: user.messengers[0].from,
                        });
                    ctx.status = 200;
                } else {
                    ctx.status = 404;
                }
            } catch (e) {
                console.log(e);
                ctx.status = 500;
            }
        } else {
            ctx.status = 400;
        }
        next();
    }

    static async contactsSeeEventLog (ctx, next) {
        const data: ICourseFinishedLog = ctx.request.body;

        if (!!data.userId) {
            try {
                const userRepository = getManager().getRepository(UserEntity);

                const user = await userRepository.findOne({where: { id: data.userId }, relations: ['leader']});

                if (!!user && !!user.leader) {
                    await trackEventLog(EventLogs.contactsSee, { userId: data.userId }, user.leader, user);
                    ctx.status = 200;
                } else {
                    ctx.status = 404;
                }
            } catch (e) {
                console.log(e);
                ctx.status = 500;
            }
        } else {
            ctx.status = 400;
        }
        next();
    }
}