import { useState, useEffect } from 'react';

import { useNavigate, Link } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import toast from 'react-hot-toast';



const SignupPage = () => {

  const [formData, setFormData] = useState({

    name: '',

    username: '',

    email: '',

    password: '',

  });

  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();



  useEffect(() => {

    const token = localStorage.getItem('token');

    if (token) {

      navigate('/'); // If token exists, redirect to the main app

    }

  }, [navigate]);



  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError(null);

    setIsLoading(true);

    try {

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(formData),

      });



      const data = await response.json();

      if (!response.ok) {

        throw new Error(data.message || 'Failed to sign up');

      }



      // --- NEW: Show success toast and delay redirect ---

      toast.success('Verification link sent!');



      setTimeout(() => {

        navigate('/login'); // Redirect after 2 seconds

      }, 2000);



    } catch (err) {

      setError(err.message);

      toast.error(err.message); // Also show an error toast on failure

    }

    finally {

      setIsLoading(false); // Stop loading, regardless of success or error

    }

  };



  return (

    <motion.div

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      exit={{ opacity: 0 }}

      transition={{ duration: 0.5 }}

    >

      {/* // -> Added responsive padding to the main container for better spacing on all devices */}
<div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[rgb(var(--background-from))] via-[rgb(var(--background-via))] to-[rgb(var(--background-to))] p-4 sm:p-6 lg:p-8">

    {/* // -> Responsive Card: Seamless on mobile, styled "floating card" on larger screens (sm:) */}
    <div className="w-full max-w-md space-y-6 p-6 sm:p-10
                   sm:bg-[rgb(var(--card-bg))] sm:backdrop-blur-md sm:rounded-2xl sm:shadow-2xl sm:border sm:border-[rgb(var(--card-border))]">

        <div className="text-center space-y-2">
            {/* // -> Scaled font size for better readability on mobile vs. desktop */}
            <h1 className="text-3xl xsm:text-4xl pb-5 font-extrabold text-[rgb(var(--text-primary))]">
                Create an Account
            </h1>
        </div>

        {/* // -> Reduced vertical spacing on the form for a more compact mobile view */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-[rgb(var(--text-primary))] bg-[rgb(var(--input-bg))] border border-[rgb(var(--input-border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-from))]"
                />
            </div>
            <div>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-[rgb(var(--text-primary))] bg-[rgb(var(--input-bg))] border border-[rgb(var(--input-border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-from))]"
                />
            </div>
            <div>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-[rgb(var(--text-primary))] bg-[rgb(var(--input-bg))] border border-[rgb(var(--input-border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-from))]"
                />
            </div>
            <div>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-[rgb(var(--text-primary))] bg-[rgb(var(--input-bg))] border border-[rgb(var(--input-border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-from))]"
                />
            </div>
            {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <div>
                {/* // -> Added interactive hover effect for better user feedback */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-3 cursor-pointer font-semibold text-[rgb(var(--primary-text))] bg-gradient-to-r from-[rgb(var(--send-btn-from))] to-[rgb(var(--send-btn-to))] rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105"
                >
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </div>
        </form>

        <p className="text-sm text-center text-[rgb(var(--text-subtle))]">
            Already have an account?{" "}
            <Link
                to="/login"
                className="font-medium text-[rgb(var(--back-btn))] hover:underline"
            >
                Log In
            </Link>
        </p>
    </div>
</div>

    </motion.div>

  );

};



export default SignupPage;

