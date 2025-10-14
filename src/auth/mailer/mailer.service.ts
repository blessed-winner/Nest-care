import { Injectable, OnModuleInit } from '@nestjs/common';
import { version } from 'os';
const Mailjet = require('node-mailjet')
import * as path from 'path'
import * as ejs from 'ejs'
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
const nodemailer = require('nodemailer')

@Injectable()
export class MailerService implements OnModuleInit {
    private transporter:Transporter<SMTPTransport.SentMessageInfo>

    constructor(private config:ConfigService){}
    async onModuleInit() {
        await this.initTransporter()
    }

    private async initTransporter(){
         this.transporter = nodemailer.createTransport({
            host:this.config.get<string>('MAIL_HOST'),
            port:Number(this.config.get<string>('SMTP_PORT')),
            secure:false,
            auth:{
                user:this.config.get<string>('SMTP_USERNAME'),
                pass:this.config.get<string>('SMTP_PASSWORD')
            }
         } as SMTPTransport.Options)
    }

    async sendVerificationEmail(to:string,token:string,name:string){
        try{
        const verificationUrl = `http://localhost:3000/auth/verify-user?token=${token}`
        const templatePath =  path.join(process.cwd(),"src","auth","mailer","templates","verify-email.ejs")
        const htmlContent = await ejs.renderFile(templatePath,{verificationUrl,name})

        const info = await this.transporter.sendMail({
            from: '"Nest-care" <noreply@nestcare.test>',
            to,
            subject: "Email verification",
            html:htmlContent
        })

        console.log(`Verification email sent to ${to}` )
        } catch(error){
           console.error('An error occured', error)
        }
      
    }
    /*
    //Mailjet email verification
    private client:any
    constructor(){
         this.client = Mailjet.apiConnect(
            process.env.MAILJET_API_KEY!,
            process.env.MAILJET_SECRET_KEY!
         )
    }

    async sendVerificationEmail(to:string,token:string){
        const verificationUrl = `http://localhost:3000/auth/verify-user?token=${token}`
        const templatePath =  path.join(process.cwd(),"src","auth","mailer","templates","verify-email.ejs")
        const htmlContent = await ejs.renderFile(templatePath,{verificationUrl})
        try {
            await this.client
            .post("send",{version:'v3.1'})
            .request({
                Messages:[{
                    From:{
                        Email:"blessedwinner66@gmail.com",
                        Name:"Nest-care enterprises"
                    },
                    To:[{Email:to}],
                    Subject:"Email Verification",
                    HTMLPart: htmlContent
                }]
            })
            console.log(`Verification email sent to ${to}`)
        } catch (error){
            console.error('Failed to send verification email',error)
            throw error
        }
    }*/


}
