import { getManager } from 'typeorm';

import { LeadEntity } from "./lead.entity";
import { PartnerEntity } from '../partner/partner.entity';
import { ILead } from './DTO/lead';

export class LeadController {
    static async create (ctx, next) {
        const data = <ILead>ctx.params;

        const partnerRepository = getManager().getRepository(PartnerEntity);
        const leadRepository = getManager().getRepository(LeadEntity);

        const partner = await partnerRepository.findOne({ where: { referId: data.referId } });
        const newLead = await leadRepository.create({
            partner: partner,
            type: Number.parseInt(data.type),
            createdDate: new Date().toISOString()
        });
        await leadRepository.save(newLead);

        ctx.status = 200;

        await next();
    }
}