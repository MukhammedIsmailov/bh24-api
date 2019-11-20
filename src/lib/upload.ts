import { readFileSync, writeFileSync } from 'fs';
import { normalize } from 'path';
import { createHash } from 'crypto';

export function upload(ctx, next) {
    const maxSize = 10485760;
    const types = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

    const icon = ctx.request.files.avatar;

    if(icon.size <= maxSize && types.indexOf(icon.type) !== -1) {
        try {
            const hash = createHash('md5').update(Math.random().toString()).digest('hex');
            const filePath = normalize(`${__dirname}/../../data/icons/${hash}_${icon.name}`);
            writeFileSync(filePath, readFileSync(icon.path));
            ctx.response.body = { iconName: `${hash}_${icon.name}`};
            ctx.status = 201;
        }
        catch (e) {
            console.log(e);
            ctx.status = 400;
        }
    } else {
        ctx.status = 415;
    }
    next();
}