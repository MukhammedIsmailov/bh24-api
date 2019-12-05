import { getManager } from 'typeorm';

import { ILandingVisitLog } from './DTO/ILandingVisitLog';
import { UserEntity } from '../user/user.entity';
import { EventLogs } from '../../lib/eventLogs';
import { trackEventLog } from './event.service';

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
}