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
                console.log('1')
            } else {
                const partnerRepository = getManager().getRepository(PartnerEntity);
                ctx.currentPartner = await partnerRepository.findOne({ id: decoded.id });
                ctx.token = token;
                console.log('2')
                next();
            }
        });
    } else {
        console.log('3');
        ctx.status = 401;
    }
}