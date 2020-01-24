import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as json from 'koa-json';
import * as bodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';
import * as serve from 'koa-static';
import * as mount from 'koa-mount';
import * as socket from 'socket.io';
import * as http from 'http';

import { createConnection } from 'typeorm';

import routes from './routes';

import 'reflect-metadata';

import { getConfig } from './config';

createConnection().then(async connection => {

    const app = new Koa();
    const port = getConfig().appPort;

    app.use(json());
    app.use(logger());
    app.use(bodyParser());
    app.use(cors());
    app.use(mount('/data', serve('./data')));

    app.use( async(ctx, next) => {
        try {
            await next();
        } catch (e) {
            ctx.status = e.status || 500;
            ctx.body = e.message;
            ctx.app.emit('error', e, ctx);
        }
    });

    app.use(routes.routes()).use(routes.allowedMethods());

    const server = http.createServer(app.callback());

    app.context.io = socket(server);

    server.listen(port, () => {
        console.log(port);
    });
});