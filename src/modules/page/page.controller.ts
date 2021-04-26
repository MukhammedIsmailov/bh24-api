import { IPage } from './DTO/IPage';
import { getManager } from 'typeorm';
import { PageEntity } from './page.entity';

export class PageController {
    static async pageCreate(ctx, next) {
        try {
            const data: IPage = ctx.request.body;
            data.isSystem = false;
            const pageRepository = getManager().getRepository(PageEntity);
            const dataFromDB = await pageRepository.findOne({
                where: [
                    { name: data.name },
                    { verboseName: data.verboseName }
                ]
            });

            if (!dataFromDB) {
                const createdPage = await pageRepository.create(data);
                await pageRepository.save(createdPage);

                ctx.status = 200;
                next();
            } else {
                ctx.status = 400;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }

    static async pageReadAll(ctx, next) {
        try {
            const pageRepository = getManager().getRepository(PageEntity);
            const dataFromDB = await pageRepository.find({ select: [ 'id', 'isSystem', 'name', 'verboseName' ] });

            ctx.response.body = dataFromDB;
            ctx.status = 200;
            next();
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }

    static async pageRead(ctx, next) {
        try {
            const pageRepository = getManager().getRepository(PageEntity);
            const pageId = ctx.request.query.id;
            const name = ctx.request.query.name;
            let dataFromDb;

            if (pageId && !name) {
                dataFromDb = await pageRepository.findOne(pageId);
            }
            else if (!pageId && name ) {
                dataFromDb = await pageRepository.findOne({ name });
            }
            else {
                ctx.status = 400;
            }

            if (!!dataFromDb) {
                ctx.response.body = dataFromDb;
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

    static async pageUpdate(ctx, next) {
        try {
            const data: IPage = ctx.request.body;
            delete data.isSystem;
            const pageId = ctx.request.query.id;

            const pageRepository = getManager().getRepository(PageEntity);

            const dataFromDB = await pageRepository.find({
                where: [
                    { name: data.name },
                    { verboseName: data.verboseName }
                ]
            });

            if (!dataFromDB.find(item => item.id == pageId)) {
                await  pageRepository.update(pageId, data);
                ctx.status = 200;
                next();
            } else {
                ctx.status = 400;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }

    static async pageDelete(ctx, next) {
        try {
            const pageId = ctx.request.query.id;
            const pageRepository = getManager().getRepository(PageEntity);

            const dataFromDB = await pageRepository.findOne(pageId);
            if (!!dataFromDB) {
                if (!dataFromDB.isSystem) {
                    await pageRepository.delete(pageId);
                    ctx.status = 200;
                    next();
                } else {
                    ctx.status = 403;
                }
            } else {
                ctx.status = 404;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }
}
