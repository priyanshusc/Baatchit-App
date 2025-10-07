// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                        className="w-full max-w-sm bg-[rgb(var(--card-bg))] border border-[rgb(var(--card-border))] rounded-2xl shadow-xl p-6 text-center"
                    >
                        <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))] mb-4">
                            {title}
                        </h2>
                        <p className="text-[rgb(var(--text-muted))] mb-8">
                            {children}
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg font-semibold bg-[rgb(var(--input-bg))] text-[rgb(var(--text-primary))] hover:opacity-80 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-6 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;