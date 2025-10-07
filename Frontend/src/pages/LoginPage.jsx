import { useState, useEffect } from 'react';

import { useNavigate, Link } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import { ThemeContext } from '../context/Theme'; // ✅ import context

import toast from 'react-hot-toast';



const LoginPage = () => {

  const [formData, setFormData] = useState({

    username: '',

    password: '',

  });

  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();



  // ✅ get theme from context

  // const { theme } = useContext(ThemeContext);



  useEffect(() => {

    const token = localStorage.getItem('token');

    if (token) {

      navigate('/chat');

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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify(formData),

      });



      const data = await response.json();

      if (!response.ok) {

        throw new Error(data.message || 'Failed to log in');

      }



      toast.success('Logged in successfully!'); // Optional success toast

      localStorage.setItem('token', data.token);

      navigate('/chat');



    } catch (err) {

      setError(err.message);

    }

    finally {

      setIsLoading(false); // 4. Stop loading

    }

  };



  return (

    <motion.div

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      exit={{ opacity: 0 }}

      transition={{ duration: 0.5 }}

    >

      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[rgb(var(--background-from))] via-[rgb(var(--background-via))] to-[rgb(var(--background-to))] p-4 sm:p-6 lg:p-8">

    {/* // -> Responsive Card:
      //    - On mobile (default): No background, shadow, or border. Takes up full width.
      //    - On small screens and up (sm:): Reintroduces the card styling, backdrop blur, etc.
    */}
    <div className="w-full max-w-md space-y-8 p-6 sm:p-10 
                   sm:bg-[rgb(var(--card-bg))] sm:backdrop-blur-md sm:rounded-2xl sm:shadow-2xl sm:border sm:border-[rgb(var(--card-border))]">

        <div className="text-center space-y-2 sm:space-y-4">
            {/* // -> Scaled font size for better readability on mobile */}
            <h1 className="text-5xl pb-10 sm:pb-2 font-extrabold text-[rgb(var(--text-primary))]">
                Baatchit
            </h1>
            <p className="text-[rgb(var(--text-muted))]">
                Welcome back! Please log in to continue.
            </p>
        </div>

        {/* // -> Reduced vertical spacing on mobile for a more compact form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-[rgb(var(--text-primary))] bg-[rgb(var(--input-bg))] border border-[rgb(var(--input-border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-from))]"
                />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer px-4 py-3 font-semibold text-[rgb(var(--primary-text))] bg-gradient-to-r from-[rgb(var(--send-btn-from))] to-[rgb(var(--send-btn-to))] rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105"
                >
                    {isLoading ? 'Logging In...' : 'Log In'}
                </button>
            </div>
        </form>

        <p className="text-sm text-center text-[rgb(var(--text-subtle))]">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-medium text-[rgb(var(--back-btn))] hover:underline">
                Sign Up
            </Link>
        </p>
    </div>
</div>

    </motion.div>

  );

};



export default LoginPage;

