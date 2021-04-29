import * as busboy from 'async-busboy';
import { readFileSync, writeFileSync, readdirSync, existsSync, unlinkSync } from 'fs';
import { normalize } from 'path';

export class FileController {
    static async fileCreate(ctx, next) {
        try {
            const { files } = await busboy(ctx.req);
            const file: any = files[0];
            const filePath = normalize(`${__dirname}/../../../data/storage/${file.filename}`)
            writeFileSync(filePath, readFileSync(file.path));
            ctx.response.body = { url: `https://api.${process.env.SITE_URL}/data/storage/${file.filename}` };
            ctx.status = 200;
            next();
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }

    static async fileReadAll(ctx, next) {
        try {
            const filePath = normalize(`${__dirname}/../../../data/storage/`);
            const files = readdirSync(filePath)
                .map(item => ({ filename: item, url: `https://api.${process.env.SITE_URL}/data/storage/${item}` }));
            ctx.response.body = files;
            ctx.status = 200;
            next();
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }

    static async fileDelete(ctx, next) {
        try {
            const fileName = ctx.request.query.fileName;
            const filePath = normalize(`${__dirname}/../../../data/storage/${fileName}`);
            if (existsSync(filePath)) {
                unlinkSync(filePath);
                ctx.status = 200;
                next();
            } else {
                ctx.status = 404;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }
}
