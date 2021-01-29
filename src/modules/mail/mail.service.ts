import { Queue, Worker } from "bullmq";
import { createTransport } from "nodemailer";
import { emailTemplateReset } from "./email-template";

export function initQueue (appContext) {
    appContext.queue = new Queue('mail', {
        connection: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT)
        }
    });
    new Worker('mail', async ({ data }) => {
        sendEmail(data);
    });
}

export async function sendEmail(data) {
    const transport = createTransport({
        host: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_LOGIN,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: data.email,
        subject: data.subject,
        text: data.text
    }

    await transport.sendMail(mailOptions);
}