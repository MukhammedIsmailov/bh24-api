import { getManager } from 'typeorm';

import { LeadEntity } from './lead.entity';
import { PartnerEntity } from '../partner/partner.entity';
import { LeadMessengersEntity } from '../leadMessengers/leadMessengers.entity';
import { ILead } from './DTO/ILead';
import { Messenger } from '../leadMessengers/DTO/IMessengerInfo';

export class LeadController {
    static async create (ctx, next) {
        const data = <ILead>ctx.request.body;

        const partnerRepository = getManager().getRepository(PartnerEntity);
        const leadRepository = getManager().getRepository(LeadEntity);
        const leadMessengersRepository = getManager().getRepository(LeadMessengersEntity);

        const partner = await partnerRepository.findOne({ where: { referId: data.referId } });
        const newLead = await leadRepository.create({
            partner: partner,
            type: Number.parseInt(data.type),
            createdDate: new Date().toISOString()
        });
        const savedLead = await leadRepository.save(newLead);
        const newLeadMessengers = await leadMessengersRepository.create({
            lead: savedLead,
            telegramInfo: (data.messengerInfo.messenger === Messenger.Telegram) ? data.messengerInfo.info : null,
            facebookInfo: (data.messengerInfo.messenger === Messenger.Facebook) ? data.messengerInfo.info : null,
            viberInfo: (data.messengerInfo.messenger === Messenger.Viber) ? data.messengerInfo.info : null
        });
        await leadMessengersRepository.save(newLeadMessengers);

        ctx.status = 200;

        await next();
    }
}