"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMailer = void 0;
const nodeMailer = require("nodemailer");
const SendGrid = require("nodemailer-sendgrid-transport");
class NodeMailer {
    static initializeTransport() {
        return nodeMailer.createTransport(SendGrid({
            auth: {
                api_key: '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'
            }
        }));
    }
    static sendEmail(data) {
        return NodeMailer.initializeTransport().sendMail({
            from: 'itpebedpssnzmccyar@wqcefp.com',
            to: data.to,
            subject: data.subject,
            html: data.html
        });
    }
}
exports.NodeMailer = NodeMailer;
