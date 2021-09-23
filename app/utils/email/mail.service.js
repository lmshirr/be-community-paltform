const nodeMailer = require('nodemailer');
const { InternalServerException } = require('../httpExceptions');

class MailService {
  constructor() {
    if (MailService.instance == null) {
      this.transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      // make instance for singleton class
      MailService.instance = this;
    }
    return MailService.instance;
  }

  async sendEmail(destination, link) {
    console.log(destination);
    this.transporter.sendMail(
      {
        to: destination,
        subject: 'Please confirm your Email account',
        html: `Hello,<br> Please Click on the link to verify your email.<br><a href=${link}>Click here to verify</a>`,
      },
      (err, info) => {
        if (err) {
          console.log(err, info);
          throw new InternalServerException('Internal server error', err);
        }
        console.log('Message sent');
      }
    );
  }
}

const mailService = new MailService();

module.exports = mailService;
