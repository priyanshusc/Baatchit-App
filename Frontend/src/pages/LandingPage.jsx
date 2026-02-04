import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/chat');
        }
    }, [navigate]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-gradient-to-br from-[rgb(var(--background-from))] via-[rgb(var(--background-via))] to-[rgb(var(--background-to))] text-white min-h-screen flex flex-col md:flex-row py-52 md:py-0">

                <div className="flex flex-1 items-center justify-center p-6 md:p-8">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold logo-text">Baatchit</h1>
                </div>

                <div className="flex flex-1 items-center justify-center p-6 md:p-8">
                    <div className="max-w-md w-full space-y-6 md:space-y-8">
                        <div className='text-center md:text-left'>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold start-heading">Start the conversation.</h2>
                            <p className="mt-4 md:mt-6 text-xl md:text-2xl tracking-wide font-semibold join-text">Join Baatchit today.</p>
                        </div>
                        <div className='space-y-4'>
                            <div className="flex flex-col space-y-4">
                                <Link to="/signup">
                                    <button className="w-full py-3 px-4 bg-gradient-to-br from-[rgb(var(--send-btn-from))] to-[rgb(var(--send-btn-to))] cursor-pointer rounded-full font-bold">
                                        Create account
                                    </button>
                                </Link>
                            </div>
                            {/* <div className="relative"> */}
                            {/* <div className="absolute inset-0 flex items-center"> */}
                            {/* <div className="w-full border-t border-gray-700" /> */}
                            {/* </div> */}
                            <div className="flex justify-center text-md">
                                <span className="px-2 text-gray-500">OR</span>
                            </div>
                            {/* </div> */}
                            <div className="text-center md:text-left">
                                <p className="font-bold mb-2" style={{ color: `rgb(var(--text-subtle))` }}>
                                    Already have an account?
                                </p>
                                <Link to="/login">
                                    <button className="w-full cursor-pointer py-3 px-4 rounded-full font-bold sign-in-btn">
                                        Sign in
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LandingPage;

