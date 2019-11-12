import { getManager } from 'typeorm';
import { LeadMessengersEntity } from './leadMessengers.entity';

export class LeadMessengersController {
        static async readAll (ctx, next) {
        // <
        const query = `SELECT * FROM lead_messengers WHERE last_send_time < now() - INTERVAL ${"'" + ctx.query.interval + "'"}`;
        ctx.response.body = await getManager().query(query);

        ctx.status = 200;

        await next();
    }

    static async update (ctx, next) {
        const leadMessengersRepository = getManager().getRepository(LeadMessengersEntity);
        const requestParams = ctx.request.body;
        const leadMessengerToUpdate = await leadMessengersRepository.findOne(requestParams.id);
        leadMessengerToUpdate.step = requestParams.step;
        leadMessengerToUpdate.lastSendTime = new Date().toISOString();
        await leadMessengersRepository.save(leadMessengerToUpdate);

        ctx.status = 200;

        await next();
    }
}