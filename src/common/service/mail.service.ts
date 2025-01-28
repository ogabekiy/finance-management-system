import { Injectable } from "@nestjs/common";
import {createTransport} from 'nodemailer'

@Injectable()
export class MailService{
    private transporter;

    constructor(){
        this.transporter = createTransport({
            host: 'smtp.gmail.com',
            port: 707,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            }
            
        })
        }
    async sendMail(to :string,text:string): Promise<void>{
    const subject = 'reset password';
    const mailOptions = {
      from: 'ogbkiy@gmail.com', 
      to,
      subject,
      text: `http://127.0.0.1:3000/users/${text}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email yuborildi: ' + subject);
    } catch (error) {
      console.error('Email yuborishda xato:', error);
    }
    }

}