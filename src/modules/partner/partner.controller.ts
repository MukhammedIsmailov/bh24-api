import { getManager } from 'typeorm';
import { sign } from 'jsonwebtoken';

import { ICreatePartner } from './DTO/ICreatePartner';
import { IUpdatePartner } from './DTO/IUpdatePartner';
import { IAuthorizePartner } from './DTO/IAuthorizePartner';
import { PartnerEntity } from './partner.entity';
import { createValidator, updateValidator, loginValidator } from './partner.validator';
import { getEncryptedPassword, comparePasswords } from './partner.service';
import { getConfig } from '../../config';

export class PartnerController {
    static async read (ctx, next) {
        const id = Number.parseInt(ctx.request.query.id);

        const partnerRepository = getManager().getRepository(PartnerEntity);

        const partner = await partnerRepository.findOne({ id: id });
        if (!!partner) {
            ctx.response.body = partner;
            ctx.status = 200;
        } else {
            ctx.reponse.status = 404;
        }

        next();
    }

    static async create (ctx, next) {
        try {
            const data: ICreatePartner = ctx.request.body;
            const partnerRepository = getManager().getRepository(PartnerEntity);

            const wrongFields = await createValidator(data, partnerRepository);

            if (wrongFields.length === 0) {
                const newPartner = await partnerRepository.create({ ...data, createdDate: new Date().toISOString() });

                ctx.response.body = await partnerRepository.save(newPartner);
                ctx.status = 200;
            } else {
                ctx.status = 400;
                ctx.response.body = wrongFields;
            }
        } catch (e) {
            ctx.status = 500;
            ctx.response.body = e.message;
        }

        next();
    }

    static async update (ctx, next) {
        const data: IUpdatePartner = ctx.request.body;
        const id = Number.parseInt(ctx.request.query.id);

        const partnerRepository = getManager().getRepository(PartnerEntity);

        const partner = await partnerRepository.findOne({ id: id });
        if (!!partner) {
            const wrongFields = await updateValidator(id, data, partnerRepository);
            if (wrongFields.length === 0) {
                if (!!data.password) {
                    data.password = getEncryptedPassword(data.password);
                }
                await partnerRepository.update(id, data);
                ctx.response.body = await partnerRepository.findOne({ id: id });
                ctx.status = 200;
            } else {
                ctx.response.body = wrongFields;
                ctx.status = 400;
            }
        } else {
            ctx.status = 404;
        }

        next();
    }

    static async authorize (ctx, next) {
        const data: IAuthorizePartner = ctx.request.body;

        const partnerRepository = getManager().getRepository(PartnerEntity);

        const wrongFields = loginValidator(data);

        if (wrongFields.length === 0) {
            const partner = await partnerRepository.findOne( { login: data.login });
            if (partner) {
                if (comparePasswords(partner.password, data.password)) {
                    const config = getConfig();
                    const token = sign({id: partner.id }, config.jwtSecretKey, {
                        expiresIn: config.jwtTokenExpireInMinutes
                    });
                    ctx.response.body = { token };
                    return ctx.status = 200;
                }
            } else {
                ctx.status = 404;
            }
        } else {
            ctx.status = 400;
            ctx.response.body = wrongFields;
        }

        next();
    }
}
