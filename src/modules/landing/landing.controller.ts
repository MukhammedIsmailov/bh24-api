import { readFileSync } from 'fs';

export class LandingController {
    static async getLanding1 (ctx, next) {
        ctx.set('Content-Type', 'text/html');
        ctx.response.body = readFileSync(`${__dirname}/static/landing-1.html`);
        ctx.status = 200;
        await next();
    }

    static async getLanding2 (ctx, next) {
        ctx.set('Content-Type', 'text/html');
        ctx.response.body = readFileSync(`${__dirname}/static/landing-2.html`);
        ctx.status = 200;
        await next();
    }

    static async getLanding3 (ctx, next) {
        ctx.set('Content-Type', 'text/html');
        ctx.response.body = readFileSync(`${__dirname}/static/landing-3.html`);
        ctx.status = 200;
        await next();
    }

    static async getLanding4 (ctx, next) {
        ctx.set('Content-Type', 'text/html');
        ctx.response.body = readFileSync(`${__dirname}/static/landing-4.html`);
        ctx.status = 200;
        await next();
    }


}