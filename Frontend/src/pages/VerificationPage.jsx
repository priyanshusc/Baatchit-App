import { useEffect, useState, useRef } from 'react'; // 1. Import useRef

import { useParams, Link } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';



const VerificationPage = () => {

  const [verificationStatus, setVerificationStatus] = useState('verifying');

  const [message, setMessage] = useState('Verifying your email...');

  const { token } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;

  const effectRan = useRef(false); // 2. Create a ref to track if the effect has run



  useEffect(() => {

    // 3. Check the ref to ensure this logic only runs ONCE

    if (effectRan.current === false) {

      const verifyToken = async () => {

        if (!token) {

          setVerificationStatus('error');

          setMessage('No verification token found.');

          return;

        }



        try {

          const response = await fetch(`${API_URL}/api/auth/verify/${token}`);

          const data = await response.json();



          if (response.ok) {

            setVerificationStatus('success');

            setMessage(data.message);

          } else {

            throw new Error(data.message || 'Verification failed.');

          }

        } catch (error) {

          setVerificationStatus('error');

          setMessage(error.message);

        }

      };



      verifyToken();



      // 4. Set the ref to true so this effect doesn't run again

      return () => {

        effectRan.current = true;

      };

    }

  }, [token, API_URL]); // Dependency array is correct without the ref



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

            Email Verification

          </h1>

          <p className={`text-lg ${verificationStatus === 'success' ? 'text-green-400' :

              verificationStatus === 'error' ? 'text-red-400' :

                'text-[rgb(var(--text-muted))]'

            }`}>

            {message}

          </p>

          {verificationStatus === 'success' && (

            <Link to="/login" className="inline-block mt-4 px-6 py-2 font-semibold text-[rgb(var(--primary-text))] bg-gradient-to-r from-[rgb(var(--primary-from))] to-[rgb(var(--primary-to))] rounded-lg shadow-md hover:opacity-90 transition">

              Proceed to Login

            </Link>

          )}

        </div>

      </div>

    </motion.div>

  );

};



export default VerificationPage;

