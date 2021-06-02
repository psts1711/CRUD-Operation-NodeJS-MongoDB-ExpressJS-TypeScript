import * as nodeMailer from 'nodemailer';
import * as SendGrid from 'nodemailer-sendgrid-transport'

export class NodeMailer{

     private static initializeTransport(){
         return nodeMailer.createTransport(SendGrid(
             {
                 auth: {
                     api_key: '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'
                 }
             }
         ))
     }

      static sendEmail(data:{to:[string], subject:string, html:string}):Promise<any>{
        return NodeMailer.initializeTransport().sendMail({
             from:'itpebedpssnzmccyar@wqcefp.com',
             to: data.to,
             subject: data.subject,
             html: data.html
         })
      }



}