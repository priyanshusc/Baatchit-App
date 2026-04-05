// Backend/utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Use the explicit host
    port: 465,              // Direct SSL port
    secure: true,           // Required for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // MUST be a 16-character App Password
    },
    // Adding a specific timeout to ensure the request fails clearly if blocked
    connectionTimeout: 15000, 
    greetingTimeout: 10000,
  });

  const mailOptions = {
    from: `Baatchit App <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;