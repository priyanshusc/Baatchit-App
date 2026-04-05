import { Resend } from 'resend';

// Initialize the SDK
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const { data, error } = await resend.emails.send({
      // 1. Initially, use this for testing
      from: 'Baatchit <onboarding@resend.dev>', 
      // 2. Once verified, change to: 'Baatchit <verify@priyanshusc.tech>'
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    // This throw ensures your auth.routes.js catch block triggers 
    // and deletes the user if the mail fails.
    throw error; 
  }
};

export default sendEmail;




// import nodemailer from 'nodemailer';

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: `Baatchit App <${process.env.EMAIL_USER}>`,
//     to: options.email,
//     subject: options.subject,
//     html: options.html,
//   };

//   await transporter.sendMail(mailOptions);
// };

// export default sendEmail;
