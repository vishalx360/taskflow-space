import { readFile } from "fs/promises";
import path from "path";

const OTP_EMAIL = async ({ recevierEmail, otp, name = "" }: { recevierEmail: string, otp: string, name?: string }) => {
    const subject = "OTP for taskflow.space";
    const body = `Your one-time password for Taskflow is ${otp}. Do not share this OTP with anyone for security reasons. This will be valid for the next 10 minutes.\n
    Regards,
    `;
    const filepath = path.join(process.cwd(), 'src/utils/email-templates/otp-email.html');

    const rawHTML = await readFile(filepath, 'utf8')
    return {
        to: recevierEmail,
        subject,
        text: body,
        html: rawHTML
            .toString()
            .replace("INSERT_OTP", otp)
            .replace("INSERT_NAME", name),
    };
}

const BASIC_EMAIL = async ({ recevierEmail, subject, body }: { recevierEmail: string, subject: string, body: string }) => {
    const filepath = path.join(process.cwd(), 'src/utils/email-templates/basic-email.html');
    const rawHTML = await readFile(filepath, 'utf8')

    return {
        to: recevierEmail,
        text: body,
        html: rawHTML
            .toString()
            .replace("INSERT_SUBJECT", subject)
            .replace("INSERT_BODY", body),
        subject,

    };
}

export { OTP_EMAIL, BASIC_EMAIL }