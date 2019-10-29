import { IPartner } from './DTO/partner';
import { PartnerEntity } from "./partner.entity";

export class PartnerController {
    static async create (ctx, next) {
        const data = <IPartner>ctx.request.body;
        

        await next();
    }
}