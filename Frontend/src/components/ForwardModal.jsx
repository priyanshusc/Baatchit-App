import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

const ForwardModal = ({ isOpen, onClose, users, onForward }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleToggleUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleConfirmForward = () => {
        onForward(selectedUsers);
        setSelectedUsers([]); // Reset for next time
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm h-[60vh] bg-[rgb(var(--card-bg))] border border-[rgb(var(--card-border))] rounded-2xl shadow-xl p-6 flex flex-col"
                    >
                        <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))] mb-4 flex-shrink-0">Forward to...</h2>
                        
                        {/* User List */}
                        <div className="flex-1 overflow-y-auto pr-2">
                            <ul className="space-y-2">
                                {users.map(user => {
                                    const isSelected = selectedUsers.includes(user._id);
                                    return (
                                        <li
                                            key={user._id}
                                            onClick={() => handleToggleUser(user._id)}
                                            className={`flex items-center p-2 rounded-lg cursor-pointer text-[rgb(var(--text-primary))] transition ${isSelected ? 'bg-[rgb(var(--send-btn-from))] text-white' : 'hover:bg-[rgb(var(--input-bg))]'}`}
                                        >
                                            <img src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${user.name}`} alt="avatar" className="w-10 h-10 rounded-full mr-3" />
                                            <span>{user.name}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-6 flex-shrink-0">
                            <button onClick={onClose} className="px-5 py-2 rounded-lg font-semibold bg-[rgb(var(--input-bg))] text-[rgb(var(--text-primary))] hover:opacity-80 transition">
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmForward}
                                disabled={selectedUsers.length === 0}
                                className="px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-[rgb(var(--send-btn-from))] to-[rgb(var(--send-btn-to))] text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Send <FiSend size={16} />
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ForwardModal;