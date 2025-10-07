import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { HiArrowLeft, HiPencil } from "react-icons/hi";

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';



const ProfilePage = () => {

    const [user, setUser] = useState(null);

    const [isEditMode, setIsEditMode] = useState(false);

    const [formData, setFormData] = useState({

        name: '',

        dob: '',

        gender: '',

        bio: '',

        avatarSeed: '' // include avatarSeed in formData

    });

    const [message, setMessage] = useState('');

    const navigate = useNavigate();



    const API_URL = import.meta.env.VITE_API_URL;



    // Fetch user profile

    useEffect(() => {

        const fetchUserProfile = async () => {

            const token = localStorage.getItem('token');

            try {

                const response = await fetch(`${API_URL}/api/users/profile`, {

                    headers: { 'Authorization': `Bearer ${token}` }

                });

                const data = await response.json();

                if (response.ok) {

                    setUser(data);

                    setFormData({

                        name: data.name || '',

                        dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',

                        gender: data.gender || '',

                        bio: data.bio || '',

                        avatarSeed: data.avatarSeed || data.name // default seed if none in DB

                    });

                }

            } catch (error) {

                console.error("Failed to fetch profile", error);

            }

        };

        fetchUserProfile();

    }, [API_URL]);



    // Handle form input

    const handleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value });

    };



    // Submit profile update

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage('');

        const token = localStorage.getItem('token');

        try {

            const response = await fetch(`${API_URL}/api/users/profile`, {

                method: 'PUT',

                headers: {

                    'Content-Type': 'application/json',

                    'Authorization': `Bearer ${token}`

                },

                body: JSON.stringify(formData) // send all form data (including avatarSeed)

            });

            const updatedUser = await response.json();

            if (response.ok) {

                setMessage("Profile updated successfully!");

                setUser(updatedUser);

                setIsEditMode(false);

            } else {

                throw new Error(updatedUser.message || "Failed to update profile.");

            }

        } catch (error) {

            setMessage(error.message);

        }

    };



    // Randomize avatar

    const randomizeAvatar = () => {

        setFormData(prev => ({

            ...prev,

            avatarSeed: Math.random().toString(36).substring(7)

        }));

    };



    if (!user) {

        return <div className="text-white text-center p-10">Loading profile...</div>;

    }



    return (

        <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            transition={{ duration: 0.5 }}

        >

            <div className="bg-gradient-to-br from-[rgb(var(--background-from))] via-[rgb(var(--background-via))] to-[rgb(var(--background-to))] min-h-screen p-6 sm:p-10 text-white">

                <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden">



                    {/* Header */}

                    <div className="flex justify-between items-center p-5 border-b border-white/20">

                        <button

                            onClick={() => navigate(-1)}

                            className="p-2 rounded-full cursor-pointer text-[rgb(var(--msg-sent-from))] hover:bg-white/10 transition"

                        >

                            <HiArrowLeft size={24} />

                        </button>

                        <h1 className="text-xl text-[rgb(var(--edit-profile))] font-bold">Edit Profile</h1>

                        <button

                            onClick={isEditMode ? handleSubmit : () => setIsEditMode(true)}

                            className="font-semibold cursor-pointer text-[rgb(var(--msg-sent-from))] px-3 py-1 transition"

                        >

                            {isEditMode ? "Save" : "Edit"}

                        </button>

                    </div>



                    {/* Profile Content */}

                    <div className="p-6">



                        {/* Profile Photo Section */}

                        <div className="flex flex-col items-center my-6">

                            <div className="relative">

                                <img

                                    src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${formData.avatarSeed}`}

                                    alt="Profile Photo"

                                    className="w-32 h-32 rounded-full border-4 border-white/20 shadow-md"

                                />

                                {isEditMode && (

                                    <button

                                        onClick={randomizeAvatar}

                                        className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-lg hover:opacity-90 transition"

                                    >

                                        <HiPencil size={18} />

                                    </button>

                                )}

                            </div>

                            <p className="mt-3 text-gray-400 text-sm tracking-wide">PROFILE PHOTO</p>

                        </div>



                        {/* Profile Details */}

                        <div className="space-y-5">



                            {/* Name */}

                            <div className="flex justify-between items-center">

                                <label className="text-gray-500">Name</label>

                                {isEditMode ? (

                                    <input

                                        type="text"

                                        name="name"

                                        value={formData.name}

                                        onChange={handleChange}

                                        className="w-2/3 p-2 bg-white/10 border border-[#8a9597] rounded-md focus:outline-none text-[rgb(var(--edit-profile))] focus:ring-2 focus:ring-[rgb(var(--msg-sent-from))]"

                                    />

                                ) : (

                                    <span className="font-medium text-[rgb(var(--edit-profile))]">{user.name}</span>

                                )}

                            </div>



                            {/* Email */}

                            <div className="flex justify-between items-center">

                                <label className="text-gray-500">Email</label>

                                <span className="font-medium text-gray-400">{user.email}</span>

                            </div>



                            {/* Date of Birth */}

                            <div className="flex justify-between items-center">

                                <label className="text-gray-500">Date of Birth</label>

                                {isEditMode ? (

                                    <input

                                        type="date"

                                        name="dob"

                                        value={formData.dob}

                                        onChange={handleChange}

                                        className="w-2/3 p-2 bg-white/10 border text-[rgb(var(--edit-profile))] border-[#8a9597] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                                    />

                                ) : (

                                    <span className="font-medium text-[rgb(var(--edit-profile))]">{formData.dob || "Not set"}</span>

                                )}

                            </div>



                            {/* Gender */}

                            <div className="flex justify-between items-center">

                                <label className="text-gray-500">Gender</label>

                                {isEditMode ? (

                                    <select

                                        name="gender"

                                        value={formData.gender}

                                        onChange={handleChange}

                                        className="w-2/3 p-2 bg-white/10 text-[rgb(var(--edit-profile))] border border-[#8a9597] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                                    >

                                        <option value="">Select...</option>

                                        <option value="Male">Male</option>

                                        <option value="Female">Female</option>

                                        <option value="Other">Other</option>

                                    </select>

                                ) : (

                                    <span className="font-medium text-[rgb(var(--edit-profile))]">{user.gender || "Not set"}</span>

                                )}

                            </div>



                            {/* Bio */}

                            <div className="flex flex-col">

                                <label className="text-gray-500 mb-2">Bio</label>

                                {isEditMode ? (

                                    <textarea

                                        name="bio"

                                        value={formData.bio}

                                        onChange={handleChange}

                                        rows="4"

                                        className="w-full p-3 bg-white/10 text-[rgb(var(--edit-profile))] border border-[#8a9597] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                                    ></textarea>

                                ) : (

                                    <p className="font-medium text-[rgb(var(--edit-profile))]">{user.bio || "Not set"}</p>

                                )}

                            </div>

                        </div>



                        {/* Success Message */}

                        {message && (

                            <p className="mt-6 text-center text-[rgb(var(--msg-sent-from))] font-medium">

                                {message}

                            </p>

                        )}

                    </div>

                </div>

            </div>



        </motion.div>

    );

};



export default ProfilePage;

