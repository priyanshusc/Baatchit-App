import { useTheme } from "../hooks/useTheme";

import { Moon, Sun } from "lucide-react";

import { HiArrowLeft } from "react-icons/hi";

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';



export default function SettingsPage() {

    const { theme, setTheme } = useTheme();



    const toggleTheme = () => {

        setTheme(theme === "dark" ? "light" : "dark");

    };



    return (

        <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            transition={{ duration: 0.5 }}

        >

            {/* // -> Added responsive padding to the main container */}
<div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[rgb(var(--background-from))] via-[rgb(var(--background-via))] to-[rgb(var(--background-to))] p-4 sm:p-6 lg:p-8">

    {/* // -> Responsive Card:
        //    - Removed fixed width `w-[420px]`.
        //    - Now full-width on mobile (`w-full`) with a max-width on larger screens (`max-w-md`).
        //    - Card styling (bg, border, shadow) now only applies on `sm` screens and up.
    */}
    <div className="w-full max-w-md space-y-6 p-6 sm:p-8 
                   sm:bg-[rgb(var(--card-bg))] sm:border sm:border-[rgb(var(--card-border))] sm:shadow-xl sm:rounded-2xl">

        {/* // -> Scaled heading size for different screens */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(var(--text-primary))] text-center">Settings</h1>

        {/* Theme toggle */}
        <div className="flex justify-between items-center p-4 bg-[rgb(var(--setting-bg))] border border-[rgb(var(--input-border))] rounded-lg">
            <span className="text-[rgb(var(--text-primary))]">Theme</span>

            <button
                onClick={toggleTheme}
                className={`relative w-14 h-8 flex items-center rounded-full transition-colors duration-300 ${
                    theme === "dark" ? "bg-blue-500" : "bg-gray-400"
                }`}
            >
                {/* Slider circle */}
                <span
                    className={`absolute w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        theme === "dark" ? "translate-x-7" : "translate-x-1"
                    }`}
                >
                    {theme === "dark" ? "🌙" : "☀️"}
                </span>
            </button>
        </div>

        {/* Account section */}
        <div className="p-4 bg-[rgb(var(--setting-bg))] border border-[rgb(var(--input-border))] rounded-lg">
            <h2 className="text-[rgb(var(--text-primary))] font-medium">Account</h2>
            <p className="text-[rgb(var(--text-subtle))] text-sm">Manage your account preferences here.</p>
        </div>

        <a
            href="/"
            className="justify-center gap-1 flex items-center text-[rgb(var(--back-btn))] hover:underline font-medium"
        >
            <HiArrowLeft size={20} />
            Back
        </a>
    </div>
</div>

        </motion.div>



    );

}

