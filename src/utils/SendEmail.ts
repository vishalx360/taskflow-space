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
    DOMAIN_NAME,
    NODE_ENV,
} =
    process.env;

const oAuth2Client = new google.auth.OAuth2(
    NM_CLIENT_ID,
    NM_CLIENT_SECRET,
    NM_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: NM_REFRESH_TOKEN });

// decode base64 NM_DKIM_PRIVATE_KEY
const privateKey = Buffer.from(NM_DKIM_PRIVATE_KEY, 'base64').toString('utf-8');


type MailOptions = nodemailer.SendMailOptions & { dkim?: string };


// Send email
export async function SendEmail(mailOptions: MailOptions): Promise<void> {
    if (NODE_ENV !== 'production') {
        console.log("Email logged: dev mode");
        console.log(mailOptions.text)
        return
    }
    try {
        const accessToken = await oAuth2Client.getAccessToken();
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
            tls: true,
            dkim: {
                domainName: DOMAIN_NAME,
                keySelector: "nodemailer",
                privateKey
            },
        });
        // console.log(privateKey);

        const signedMessage = ({ from: NM_DEFAULT_FROM_EMAIL, ...mailOptions, });
        const info = await transporter.sendMail(signedMessage);
        console.log("Email sent:", info);
        return Promise.resolve()

    } catch (error) {
        console.error(error);
        return Promise.reject(error)
    }
}
// SendEmail()
//   .then((result) => console.log("Email sent...", result))
//   .catch((error) => console.log(error.message));






