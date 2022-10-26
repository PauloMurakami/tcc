import * as nodemailer from "nodemailer";
import config from '../config/mailConfig';

class Mail {

    constructor(
        public to?: string,
        public subject?: string,
        public message?: string) { }


    async sendMail() {
        return new Promise<any>((resolve, reject) => {
            let mailOptions = {
                from: "noreply@gmail.com",
                to: this.to,
                subject: this.subject,
                html: this.message
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

            resolve(
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return error;
                    } else {
                        return "E-mail enviado com sucesso!";
                    }
                })
            )
        })
    }

}

export default new Mail;