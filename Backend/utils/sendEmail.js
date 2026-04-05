// Backend/utils/sendEmail.js
import { Resend } from 'resend';

// Initialize the SDK
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    try {
        const { data, error } = await resend.emails.send({
            // This is now fully authorized!
            from: 'Baatchit <verify@priyanshusc.tech>',
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
        throw error; // Triggers your signup rollback
    }
};

export default sendEmail;