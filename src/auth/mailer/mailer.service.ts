import { Injectable } from '@nestjs/common';
import { version } from 'os';
const Mailjet = require('node-mailjet')
import * as path from 'path'
import * as ejs from 'ejs'

@Injectable()
export class MailerService {
    private client:any
    constructor(){
         this.client = Mailjet.apiConnect(
            process.env.MAILJET_API_KEY!,
            process.env.MAILJET_SECRET_KEY!
         )
    }

    async sendVerificationEmail(to:string,token:string){
        const verificationUrl = `http://localhost:8000/auth/verify-email?token=${token}`
        const templatePath =  path.join(__dirname,"templates","verify-email")
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
    }
}
