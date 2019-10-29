import { getManager } from 'typeorm';

import { LeadEntity } from "./lead.entity";
import { PartnerEntity } from '../partner/partner.entity';

export class LeadController {
    static async read (ctx, next) {
        const { referId } = ctx.params;

        const partnerRepository = getManager().getRepository(PartnerEntity);
        const leadRepository = getManager().getRepository(LeadEntity);

        const partner = await partnerRepository.findOne({ where: { referId: referId } });
        const newLead = await leadRepository.create({ partner: partner });
        await leadRepository.save(newLead);

        ctx.status = 200;

        await next();
    }
}