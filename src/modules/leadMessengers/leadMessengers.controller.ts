import { getManager } from 'typeorm';

import { updateLeadMessengerItem } from './leadMessenger.sevice';

export class LeadMessengersController {
        static async readAll (ctx, next) {
        // <
        const query = `SELECT * FROM lead_messengers WHERE last_send_time < now() - INTERVAL ${"'" + ctx.query.interval + "'"}`;
        ctx.response.body = await getManager().query(query);

        ctx.status = 200;

        await next();
    }

    static async update (ctx, next) {
       try {
           await updateLeadMessengerItem(ctx.request.body);
           ctx.status = 200;
       } catch (e) {
           console.log(e);
           ctx.status = 500;
       }
        await next();
    }
}