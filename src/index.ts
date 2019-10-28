import * as Koa from "koa";
import * as Router from "koa-router";
import * as logger from "koa-logger";
import * as json from "koa-json";

import { getConfig } from "./config";

const app = new Koa();
const router = new Router();
const port = getConfig().appPort;

// Hello world
router.get("/", async (ctx, next) => {
    ctx.body = { msg: "Hello world!" };

    await next();
});

// Middlewares
app.use(json());
app.use(logger());

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(port);
});