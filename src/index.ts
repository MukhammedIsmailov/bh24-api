import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as json from 'koa-json';
import * as bodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';
import * as serve from 'koa-static';
import * as mount from 'koa-mount';
import * as websockify from 'koa-websocket';


import { createConnection } from 'typeorm';

import routes from './routes';

import 'reflect-metadata';

import { getConfig } from './config';

createConnection().then(async connection => {

    const app = websockify(new Koa());
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

    app.ws.use((ctx) => {
        // the websocket is added to the context as `ctx.websocket`.
        ctx.websocket.on('message', function(message) {
            console.log('message');
        });
    });

    app.use(routes.routes()).use(routes.allowedMethods());

    app.listen(port, () => {
        console.log(port);
    });
});