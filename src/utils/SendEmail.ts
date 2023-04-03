import { DKIMSign } from 'dkim-signer';
import { readFile } from "fs/promises";
import { google } from "googleapis";
import nodemailer from "nodemailer";


// These id's and secrets should come from .env file.
const { NM_CLIENT_ID,
    NM_CLIENT_SECRET,
    NM_REDIRECT_URI,
    NM_REFRESH_TOKEN,
    NM_AUTH_EMAIL,
    NM_DEFAULT_FROM_EMAIL,
    NM_DKIM_PRIVATE_KEY,
    DOMAIN_NAME
} =
    process.env;

const oAuth2Client = new google.auth.OAuth2(
    NM_CLIENT_ID,
    NM_CLIENT_SECRET,
    NM_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: NM_REFRESH_TOKEN });


type MailOptions = nodemailer.SendMailOptions & { dkim?: string };

async function signWithDKIM(message: MailOptions): Promise<MailOptions> {
    const privateKey = await readFile("DKIM_PRIVATE_KEY.pem", 'utf8');

    const dkimHeader = DKIMSign(message, {
        privateKey,
        domainName: DOMAIN_NAME,
        keySelector: "nodemailer",
    });
    return {
        ...message,
        dkim: `${dkimHeader}${message.html || message.text}`,
    };
}

// Send email
export async function SendEmail(mailOptions: MailOptions): Promise<void> {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const privateKey = await readFile("DKIM_PRIVATE_KEY.pem", 'utf8');

        const transporter = nodemailer.createTransport({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: NM_AUTH_EMAIL,
                clientId: NM_CLIENT_ID,
                clientSecret: NM_CLIENT_SECRET,
                refreshToken: NM_REFRESH_TOKEN,
                accessToken: accessToken,
            },
            secure: true,
            dkim: {
                domainName: DOMAIN_NAME,
                keySelector: "nodemailer",
                privateKey
            },
        });

        const signedMessage = ({ from: NM_DEFAULT_FROM_EMAIL, ...mailOptions, });
        // return Promise.resolve();
        const info = await transporter.sendMail(signedMessage);
        console.log("Email sent:", info);
        return Promise.reject(info.response)

    } catch (error) {
        console.error(error);
        return Promise.reject(error)
    }
}
// SendEmail()
//   .then((result) => console.log("Email sent...", result))
//   .catch((error) => console.log(error.message));






