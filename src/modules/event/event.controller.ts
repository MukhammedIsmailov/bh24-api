import { getManager } from 'typeorm';

import { ILandingVisitLog } from './DTO/ILandingVisitLog';
import { PartnerEntity } from '../partner/partner.entity';
import { EventLogs } from '../../lib/eventLogs';
import { trackEventLog } from './event.service';

export class EventController {
    static async landingVisitLogCreate (ctx, next) {
        const data = <ILandingVisitLog>ctx.request.body;

        if (!!data.referId) {
            try {
                const partnerRepository = getManager().getRepository(PartnerEntity);

                const partner = await partnerRepository.findOne({where: {referId: data.referId}});

                if (!!partner) {
                    await trackEventLog(EventLogs.courseSubscription, null, partner);
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