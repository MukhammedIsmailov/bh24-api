import { getManager } from 'typeorm';

import { IPartner } from './DTO/partner';
import { PartnerEntity } from "./partner.entity";

export class PartnerController {
    static async create (ctx, next) {
        const data = <IPartner>ctx.request.body;
        const partnerRepository = getManager().getRepository(PartnerEntity);

        const newPartner = await partnerRepository.create({ ...data, createdDate: new Date().toISOString() });

        await partnerRepository.save(newPartner);

        ctx.response.body = data;

        await next();
    }
}