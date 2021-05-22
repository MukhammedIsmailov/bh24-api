import { IContent } from './DTO/IContent';
import { getRepository } from 'typeorm';
import { ContentEntity } from './content.entity';
import { PageEntity } from '../page/page.entity';

export class ContentController {
    static async contentCreate(ctx, next) {
        try {
            const data: IContent = ctx.request.body;
            const contentRepository = await getRepository(ContentEntity);
            const pageRepository = await getRepository(PageEntity);

            const page = await pageRepository.findOne(data.pageId);
            if (!!page) {
                const content = await contentRepository.create({ ...data, page });
                const { id, body } = await contentRepository.save(content);
                ctx.response.body = { id, body };
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

    static async contentRead(ctx, next) {
        try {
            const contentId = ctx.request.query.id;
            const contentRepository = await getRepository(ContentEntity);

            const dataFromDB = await contentRepository.findOne(contentId);

            if (!!dataFromDB) {
                ctx.response.body = dataFromDB;
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

    static async contentUpdate(ctx, next) {
        try {
            const data: IContent = ctx.request.body;
            const contentId = ctx.request.query.id;
            const contentRepository = await getRepository(ContentEntity);

            const dataFromDB = await contentRepository.findOne(contentId);
            if (!!dataFromDB){
                await contentRepository.update(contentId, data);
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

    static async contentDelete(ctx, next) {
        try {
            const contentId = ctx.request.query.id;
            const contentRepository = await getRepository(ContentEntity);

            const dataFromDB = await contentRepository.findOne(contentId);
            if (!!dataFromDB) {
                await contentRepository.delete(contentId);
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

    static async contentReadByPageId (ctx, next) {
        try {
            const pageId = ctx.request.query.pageId;
            const pageRepository = await getRepository(PageEntity);
            const contentRepository = await getRepository(ContentEntity);

            const page = await pageRepository.findOne(pageId);
            console.log(page)
            if (!!page) {
                const response = await contentRepository.find({ where: { page } });
                ctx.response.body = response;
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
