// Backend/utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // 16-character App Password
    },
    // Adding extra time and TLS settings for cloud environments
    connectionTimeout: 20000, // 20 seconds
    greetingTimeout: 15000,   // 15 seconds
    socketTimeout: 20000,     // 20 seconds
    tls: {
      // This helps if the server has trouble verifying the SSL certificate
      rejectUnauthorized: false
    }
  })

  const mailOptions = {
    from: `Baatchit App <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
