import nodemailer from 'nodemailer';



const sendEmail = async (options) => {

  // 1. Create a transporter object using Gmail

  const transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {

      user: process.env.EMAIL_USER,

      pass: process.env.EMAIL_PASS,

    },

  });



  // 2. Define the email options

  const mailOptions = {

    from: `Baatchit App <${process.env.EMAIL_USER}>`,

    to: options.email,

    subject: options.subject,

    html: options.html, // We'll send HTML content

  };



  // 3. Send the email

  await transporter.sendMail(mailOptions);

};



export default sendEmail;

