const nodemailer = require('nodemailer');
import { join } from 'path';
const fs = require('fs');
// email sender function
function SendEmail(email: string, asunto: string, html: string, info: object) {
    const PATH_EMAIL = join(process.cwd(), 'src/backend/emails/');
    fs.readFile(join(PATH_EMAIL, html), 'utf-8', (err, data) => {
        // if (err) return res.status(500).send({message: `Error read file. ${err}`});
        let aux = data;
        // tslint:disable-next-line:forin
        for (const i in info) {
            aux = aux.replace('{{' + i + '}}', info[i]);
        }

        // Definimos el transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'betomax1636@gmail.com',
                pass: 'Moonblack12'
            }
        });
        // Definimos el email
        const mailOptions = {
            from: 'JOYSHOP',
            to: email,
            subject: asunto,
            html: aux
        };
        // Enviamos el email
        transporter.sendMail(mailOptions, function(error, infor) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent');
            }
        });
      });
}

export const EmailService = { SendEmail };
