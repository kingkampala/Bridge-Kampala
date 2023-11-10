import sgMail from '@sendgrid/mail';

const sg = process.env.SENDGRID_API_KEY;

if (!sg) {
    throw new Error('sending email error');
}

sgMail.setApiKey(sg);

export const sendEmail = async (to: string, subject: string, htmlContent: string): Promise<void> => {
  const msg = {
    to,
    from: 'your_email@example.com',
    subject,
    html: htmlContent,
  };

  await sgMail.send(msg);
};