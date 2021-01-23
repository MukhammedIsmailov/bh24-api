import { hashSync, compareSync } from 'bcrypt';
import { createTransport } from 'nodemailer';
import { emailTemplate } from './email-template';

const saltRounds: number = 10;

export function getEncryptedPassword(password): string {
    return hashSync(password, saltRounds);
}

export function comparePasswords(encryptedPassword, inputPassword): boolean {
    return compareSync(inputPassword, encryptedPassword);
}

export function getSubquery(subqueriesFilters) {
    let index = 0;
    let subquery = ' AND (';
    subqueriesFilters.forEach((subqueryFilter) => {
        if(!!subqueryFilter) {
            if(index !== 0) {
                subquery += ' OR ';
            }
            subquery += subqueryFilter;
            index ++;
        }
    });
    subquery += ')';

    return subquery;
}

export async function sendEmail(recipient: string, resestPasswordHash: string) {
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
        text: emailTemplate(resestPasswordHash)
    }

    await transport.sendMail(mailOptions);
}
