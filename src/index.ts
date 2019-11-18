import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as json from 'koa-json';
import * as bodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';
// import * as body from 'koa-body';

import { createConnection } from 'typeorm';

import routes from './routes'

import "reflect-metadata";

import { getConfig } from "./config";

createConnection().then(async connection => {

    const app = new Koa();
    const port = getConfig().appPort;

    app.use(json());
    app.use(logger());
    app.use(bodyParser());
    app.use(cors());
    // app.use(body({ multipart: true }));

    app.use(routes.routes()).use(routes.allowedMethods());

    app.listen(port, () => {
        console.log(port);
    });
});