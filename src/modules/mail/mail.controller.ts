import {IBugreport} from "./DTO/IBugreport";
import {emailTemplateReset} from "./email-template";


export class MailController {
    static async bugReport (ctx, next) {
            try {
                const data: IBugreport = ctx.request.body;
                ctx.queue.add('mail', { email: process.env.BUGREPORT_EMAIL, subject: `Сообщение об ошибке от ${data.contact}`, text: data.message });
                ctx.response.body = { message: 'Message was successfully sent.' };

                ctx.status = 200;
            } catch (e) {
                console.log(e);
                ctx.status = 500;
            }

            next();
    }
}