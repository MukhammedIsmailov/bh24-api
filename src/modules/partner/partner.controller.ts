import { getManager } from 'typeorm';

import { IPartner } from './DTO/IPartner';
import { PartnerEntity } from './partner.entity';
import { getEncryptedPassword } from './partner.service';

export class PartnerController {
    static async create (ctx, next) {
        const data = <IPartner>ctx.request.body;
        const partnerRepository = getManager().getRepository(PartnerEntity);

        data.password = getEncryptedPassword(data.password);

        const newPartner = await partnerRepository.create({ ...data, createdDate: new Date().toISOString() });

        await partnerRepository.save(newPartner);

        ctx.response.body = data;

        await next();
    }
}