import { Queue, Worker } from "bullmq";
import { createTransport } from "nodemailer";
import { emailTemplate } from "./email-template";

export function initQueue (appContext) {
    appContext.queue = new Queue('mail', {
        connection: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT)
        }
    });
    new Worker('mail', async ({ data }) => {
        sendEmail(data.email, data.resetPasswordHash);
    });
}

export async function sendEmail(recipient: string, resetPasswordHash: string) {
    const transport = createTransport({
        host: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_LOGIN,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: recipient,
        subject: process.env.EMAIL_SUBJECT,
        text: emailTemplate(resetPasswordHash)
    }

    await transport.sendMail(mailOptions);
}