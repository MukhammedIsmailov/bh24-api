import { verify } from 'jsonwebtoken';
import { getManager } from 'typeorm';

import { getConfig } from '../config';
import { PartnerEntity } from '../modules/partner/partner.entity';

export async function verifyToken (ctx, next) {
    const { jwtSecretKey } = getConfig();

    let token = ctx.request.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length).trimLeft()
    }

    if (token) {
        verify(token, jwtSecretKey, async function (err, decoded) {
            if (err) {
                ctx.status = 401;
            } else {
                const partnerRepository = getManager().getRepository(PartnerEntity);
                ctx.currentPartner = await partnerRepository.findOne({ id: decoded.id });
                ctx.token = token;
                next();
            }
        });
    } else {
        ctx.status = 401;
    }
}