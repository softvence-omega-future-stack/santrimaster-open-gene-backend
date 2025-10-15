import sgMail from '@sendgrid/mail';
import { configs } from '../configs';

sgMail.setApiKey(configs.email.sg_api_key as string);
type TMailContent = {
    to: string,
    subject: string,
    textBody: string,
    htmlBody: string,
    name?: string
}
// ✅ Email Sender Function
const sendMail = async (payload: TMailContent) => {
    try {
        const info = await sgMail.send({
            from: {
                email: configs.email.app_email!,
                name: "Open Gene", // optional sender name
            },
            to: payload.to,
            subject: payload.subject,
            text: payload.textBody,
            html: payload.htmlBody,
        });

        return info;
    } catch (error: any) {
        throw error;
    }
};

export default sendMail;