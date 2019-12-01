import { getManager } from 'typeorm';

import { LeadEntity } from './lead.entity';
import { PartnerEntity } from '../partner/partner.entity';
import { ILead } from './DTO/ILead';
import { createNewLeadMessengerItem } from '../leadMessengers/leadMessenger.sevice';
import { EventLogs } from '../../lib/eventLogs';
import { trackEventLog } from '../event/event.service';

export class LeadController {
    static async create (ctx, next) {
        const data = <ILead>ctx.request.body;

        if (!!data.referId) {
            try {
                const partnerRepository = getManager().getRepository(PartnerEntity);
                const leadRepository = getManager().getRepository(LeadEntity);

                const partner = await partnerRepository.findOne({ where: { referId: data.referId } });
                if (!!partner){
                    const newLead = await leadRepository.create({
                        partner: partner,
                        type: Number.parseInt(data.type),
                        createdDate: new Date().toISOString()
                    });
                    const savedLead = await leadRepository.save(newLead);
                    await createNewLeadMessengerItem(data, savedLead);

                    await trackEventLog(EventLogs.landingVisit, null, partner);

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