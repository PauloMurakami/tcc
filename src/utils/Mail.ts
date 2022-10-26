import * as nodemailer from "nodemailer";
import { IResponsePDF } from "../@types/pdf";
import config from '../config/mailConfig';
import { deletarPDF } from "./pdf";

class Mail {

    constructor(
        public to?: string,
        public subject?: string,
        public message?: string) { }


    async sendMail(id: string) {
        let mailOptions = {
            from: "noreply@gmail.com",
            to: this.to,
            subject: this.subject,
            html: this.message,
            attachments: [{
                filename: `${id}.pdf`,
                path: `./src/public/assets/${id}.pdf`,
                contentType: 'application/pdf'
            }]
        };

        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: false,
            auth: {
                user: config.user,
                pass: config.password
            },
            tls: { rejectUnauthorized: false }
        });

        return Promise.resolve(transporter.sendMail(mailOptions,async function (error, info) {
            console.log('enviando')
            if (error) {
                return error;
            } else {
                await deletarPDF(id)
                return "E-mail enviado com sucesso!";
            }
        }))
    }

}

export default new Mail;