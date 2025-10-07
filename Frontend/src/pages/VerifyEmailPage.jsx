import { Link } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';



const VerifyEmailPage = () => {

  return (

    <motion.div

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      exit={{ opacity: 0 }}

      transition={{ duration: 0.5 }}

    >

      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[rgb(var(--background-from))] via-[rgb(var(--background-via))] to-[rgb(var(--background-to))]">

        <div className="w-full max-w-md p-10 text-center space-y-6 bg-[rgb(var(--card-bg))] backdrop-blur-md rounded-2xl shadow-2xl border border-[rgb(var(--card-border))]">

          <h1 className="text-4xl font-extrabold text-[rgb(var(--text-primary))]">

            Check Your Email

          </h1>

          <p className="text-[rgb(var(--text-muted))]">

            We've sent a verification link to your email address. Please click the link to activate your account.

          </p>

          <Link to="/login" className="font-medium text-[rgb(var(--primary-from))] hover:underline">

            Back to Login

          </Link>

        </div>

      </div>

    </motion.div>

  );

};



export default VerifyEmailPage;

