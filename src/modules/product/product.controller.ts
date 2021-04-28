import { IProduct } from './DTO/IProduct';
import { getManager } from 'typeorm';
import { ProductEntity } from './product.entity';

export class ProductController {
    static async productCreate(ctx, next) {
        try {
            const productRepository = getManager().getRepository(ProductEntity);
            const data: IProduct = ctx.request.body;
            const createdProduct = await productRepository.create(data);
            await productRepository.save(createdProduct);
            ctx.status = 200;
            next();
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }

    static async productRead(ctx, next) {
        try {
            const productRepository = getManager().getRepository(ProductEntity);
            const productId = ctx.request.query.id;

            const dataFromDB = await productRepository.findOne(productId);
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

    static async productReadAll (ctx, next) {
        try {
            const productRepository = getManager().getRepository(ProductEntity);
            const dataFromDB = await productRepository.find();
            if (dataFromDB.length > 0) {
                ctx.response.body = dataFromDB;
                ctx.status = 200;
            } else {
                ctx.status = 404;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }

    static async productUpdate(ctx, next) {
        try {
            const productRepository = getManager().getRepository(ProductEntity);

            const productId = ctx.request.query.id;
            const data: IProduct = ctx.request.body;

            const dataFromDB = await productRepository.findOne(productId);
            if (!!dataFromDB) {
                await productRepository.update(productId, data);
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

    static async productDelete(ctx, next) {
        try {
            const productRepository = getManager().getRepository(ProductEntity);
            const productId = ctx.request.query.id;

            const dataFromDB = await productRepository.findOne(productId);
            if (!!dataFromDB) {
                await productRepository.delete(productId);
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
