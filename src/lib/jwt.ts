import { verify } from 'jsonwebtoken';
import { getManager } from 'typeorm';

import { getConfig } from '../config';
import { UserEntity } from '../modules/user/user.entity';

export async function verifyToken (ctx, next) {
    const { jwtSecretKey } = getConfig();

    let token = ctx.request.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length).trimLeft()
    }

    if (token) {
        try {
            const decoded: any = verify(token, jwtSecretKey);
            const partnerRepository = await getManager().getRepository(UserEntity);
            ctx.currentParnter = await partnerRepository.findOne({ where: { id: decoded.id }, select: ['id', 'role', 'referId'] });
            await next();
        } catch (e) {
            console.log(e);
            ctx.throw(401);
            await next();
        }
    } else {
        ctx.throw(401);
        await next();
    }
}