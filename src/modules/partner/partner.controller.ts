import { getManager } from 'typeorm';

import { ICreatePartner } from './DTO/ICreatePartner';
import { PartnerEntity } from './partner.entity';
import { createValidator } from './partner.validator';

export class PartnerController {
    static async create (ctx, next) {
        const data: ICreatePartner = ctx.request.body;
        const partnerRepository = getManager().getRepository(PartnerEntity);

        const wrongFields = await createValidator(data, partnerRepository);

        if (wrongFields.length === 0) {
            const newPartner = await partnerRepository.create({ ...data, createdDate: new Date().toISOString() });

            await partnerRepository.save(newPartner);
            ctx.status = 200;
            ctx.response.body = data;
        } else {
            ctx.status = 400;
            ctx.response.body = wrongFields;
        }

        await next();
    }
}