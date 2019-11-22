import { readFileSync, writeFileSync } from 'fs';
import { normalize } from 'path';
import { createHash } from 'crypto';
import * as busboy from 'async-busboy';

export async function upload(ctx, next) {
    const types = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

    const { files } = await busboy(ctx.req);

    const image: any = files[0];

    if(types.indexOf(image.mimeType) !== -1) {
        try {
            const hash = createHash('md5').update(Math.random().toString()).digest('hex');
            const filePath = normalize(`${__dirname}/../../data/icons/${hash}_${image.filename}`);
            writeFileSync(filePath, readFileSync(image.path));
            ctx.response.body = { imageName: `${hash}_${image.filename}`};
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