import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kampalacodes@gmail.com',
    pass: process.env.EMAIL_ID,
  },
});

const sendBidNotification = async (tenantEmail: string, landlordEmail: string, newBid: any) => {
  const mailOptions = {
    from: tenantEmail,
    to: landlordEmail,
    subject: 'New Bid Notification',
    text: `A new bid has been placed on your property. Details: ${JSON.stringify(newBid)}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info);
      }
    });
  });
};

export { sendBidNotification };