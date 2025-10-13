import { Injectable } from '@nestjs/common';
import { version } from 'os';
const Mailjet = require('node-mailjet')

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
                }]
            })
        } catch (error){
            
        }
    }
}
