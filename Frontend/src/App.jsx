import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import UserList from './components/UserList';
import { HiArrowLeft, HiDotsVertical } from "react-icons/hi";
import { FiSend } from "react-icons/fi";
import { Link } from 'react-router-dom';
import ForwardModal from './components/ForwardModal';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import ConfirmationModal from './components/ConfirmationModal';
import toast from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState({});
  const [mobileView, setMobileView] = useState('list');
  const [unreadMessages, setUnreadMessages] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]); // ✅ NEW
  const dropdownRef = useRef(null); // ✅ new ref
  const longPressTimer = useRef();

  const [openMenuMessageId, setOpenMenuMessageId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState({ messageId: null, type: null });
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
const [messageToForward, setMessageToForward] = useState(null);
  const menuRef = useRef(null);


  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, selectedUser]);


  // 1) fetch initial data (profile + users)
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const profileRes = await fetch(`${API_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        if (!profileRes.ok) throw new Error('Invalid token');
        setUser(profileData);

        const usersRes = await fetch(`${API_URL}/api/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const usersData = await usersRes.json();
        if (usersRes.ok) {
          setUsers(usersData);
          // 👇 POPULATE the unreadMessages state from the backend data
          const unreadMap = {};
          usersData.forEach(user => {
            if (user.unreadCount > 0) {
              unreadMap[user._id] = user.unreadCount;
            }
          });
          setUnreadMessages(unreadMap);
        }
      } catch (err) {
        console.error('Auth Error:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchInitialData();
  }, [navigate, API_URL]);

  // 2) manage socket connection
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    const newSocket = io(API_URL, { auth: { token } });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [user, API_URL]);

  // 3) helper: bring a user to top of users array
  const bringUserToTop = (userId) => {
    setUsers(prevUsers => {
      const idx = prevUsers.findIndex(u => u._id === userId);
      if (idx === -1) return prevUsers;
      const userToMove = prevUsers[idx];
      const other = prevUsers.slice(0, idx).concat(prevUsers.slice(idx + 1));
      return [userToMove, ...other];
    });
  };

  // 4) listen to socket events
  useEffect(() => {
    if (!socket || !user) return;
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // ✅ NEW: online users update
    socket.on('getOnlineUsers', (users) => {
      setOnlineUsers(users);
    });

    // Private messages
    socket.on('privateMessage', (msg) => {
      const partnerId = msg.senderId === user._id ? msg.recipientId : msg.senderId;
      setConversations(prev => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), msg]
      }));


      if (selectedUser?._id !== partnerId) {
        // Increment the count for the sender
        setUnreadMessages(prev => ({ ...prev, [partnerId]: (prev[partnerId] || 0) + 1 }));
      }
      else {
        setUnreadMessages(prev => ({ ...prev, [partnerId]: false }));
      }
      bringUserToTop(partnerId);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('getOnlineUsers'); // ✅ NEW cleanup
      socket.off('privateMessage');
    };
  }, [socket, user, selectedUser]);

  // 5) select a user (open chat & fetch messages)
  const handleSelectUser = async (u) => {
    setSelectedUser(u);
    setMobileView('chat');

    setUnreadMessages(prev => {
      const newUnread = { ...prev };
      delete newUnread[u._id]; // Remove the entry for this user
      return newUnread;
    });

    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/messages/read/${u._id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to mark messages as read', err);
    }
    try {
      const response = await fetch(`${API_URL}/api/messages/${u._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok) {
        setConversations(prev => ({ ...prev, [u._id]: data }));
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  // 6) send a message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedUser) return;

    const messageData = {
      recipientId: selectedUser._id,
      message: newMessage,
    };
    socket.emit('privateMessage', messageData);

    const ownMessage = { senderId: user._id, recipientId: selectedUser._id, message: newMessage };
    setConversations(prev => ({
      ...prev,
      [selectedUser._id]: [...(prev[selectedUser._id] || []), ownMessage]
    }));

    setUnreadMessages(prev => ({ ...prev, [selectedUser._id]: false }));
    bringUserToTop(selectedUser._id);
    setNewMessage('');
  };

  const handleOpenModal = (messageId, type) => {
    console.log("Opening modal for:", messageId, type); // Good for debugging
    setDeleteAction({ messageId, type });
    setIsModalOpen(true);
    setOpenMenuMessageId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDeleteAction({ messageId: null, type: null });
  };

  const handleConfirmDelete = () => {
    if (deleteAction.type === 'me') {
      handleDeleteMessage(deleteAction.messageId);
    } else if (deleteAction.type === 'everyone') {
      handleDeleteForEveryone(deleteAction.messageId);
    }
    handleCloseModal();
  };

  const handleDeleteMessage = async (messageId) => {
    setConversations(prev => ({
      ...prev,
      [selectedUser._id]: prev[selectedUser._id].filter(msg => msg._id !== messageId)
    }));
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/messages/delete/${messageId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleDeleteForEveryone = async (messageId) => {
    setConversations(prev => ({
      ...prev,
      [selectedUser._id]: prev[selectedUser._id].filter(msg => msg._id !== messageId)
    }));
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      socket.emit('deleteMessageForEveryone', {
        messageId,
        recipientId: selectedUser._id
      });
    } catch (error) {
      console.error("Error deleting message for everyone:", error);
    }
  };

  const handleLogout = () => {
    if (socket) socket.disconnect();
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const handleTouchStart = (messageId) => {
    // Start a timer when the user touches the screen
    longPressTimer.current = setTimeout(() => {
      setOpenMenuMessageId(messageId);
    }, 500); // Trigger after 500 milliseconds
  };

  const handleTouchEnd = () => {
    // If the user lifts their finger before 500ms, cancel the timer
    clearTimeout(longPressTimer.current);
  };

  const handleCopyMessage = async (messageText) => {
    try {
        await navigator.clipboard.writeText(messageText);
        toast.success('Copied to clipboard!');
    } catch (err) {
        toast.error('Failed to copy message.');
        console.error('Failed to copy message: ', err);
    }
    setOpenMenuMessageId(null); // Close the menu after copying
};

const handleOpenForwardModal = (message) => {
    setMessageToForward(message);
    setIsForwardModalOpen(true);
    setOpenMenuMessageId(null); // Close the ellipsis menu
};

const handleCloseForwardModal = () => {
    setIsForwardModalOpen(false);
    setMessageToForward(null);
};

const handleConfirmForward = (selectedUserIds) => {
    if (!messageToForward || selectedUserIds.length === 0) return;

    // Loop through the selected user IDs and send the message to each one
    selectedUserIds.forEach(userId => {
        socket.emit('privateMessage', {
            recipientId: userId,
            message: messageToForward.message,
        });
        // We can also add an optimistic update for forwarded messages if needed
    });

    toast.success(`Forwarded message to ${selectedUserIds.length} user(s)!`);
    handleCloseForwardModal();
};


  const currentMessages = selectedUser ? (conversations[selectedUser._id] || []) : [];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
      >
        Are you sure you want to delete this message? This action cannot be undone.
      </ConfirmationModal>

      <ForwardModal
            isOpen={isForwardModalOpen}
            onClose={handleCloseForwardModal}
            users={users} // Pass the list of all users
            onForward={handleConfirmForward}
        />
      <div className="max-h-[100dvh] bg-gradient-to-br from-[rgb(var(--background-from))] via-[rgb(var(--background-via))] to-[rgb(var(--background-to))] text-[rgb(var(--text-primary))] h-screen flex flex-col p-6">
        <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center flex-shrink-0">
            <div>
              <h1 className="text-3xl font-extrabold">
                {user ? user.name.split(" ")[0] : "..."}
              </h1>
              <p className="text-[rgb(var(--text-subtle))]">
                Status:{" "}
                {isConnected ? (
                  <span className="text-green-400 font-medium">Online</span>
                ) : (
                  <span className="text-red-400 font-medium">Offline</span>
                )}
              </p>
            </div>
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(prev => !prev)}>
                <img
                  src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${user?.name || 'default'}`}
                  alt="profile"
                  className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-[rgb(var(--msg-sent-from))] transition"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-14 right-0 w-48 bg-[rgb(var(--card-bg))] backdrop-blur-md border border-[rgb(var(--card-border))] rounded-xl shadow-xl py-2 z-10">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--input-bg))]">Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--input-bg))]">Settings</Link>
                  <div className="border-t border-[rgb(var(--card-border))] my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[rgb(var(--input-bg))] rounded-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main chat area */}
          <div className="flex gap-6 flex-1 min-h-0">
            {/* USER LIST */}
            <div className={`w-full md:w-1/4 bg-[rgb(var(--card-bg))] backdrop-blur-md border border-[rgb(var(--card-border))] p-4 rounded-2xl shadow-lg flex-col ${mobileView === 'list' ? 'flex' : 'hidden'} md:flex`}>
              <UserList
                users={users}
                onSelectUser={handleSelectUser}
                selectedUser={selectedUser}
                unreadMessages={unreadMessages}
                onlineUsers={onlineUsers}
              />
            </div>

            {/* CHAT WINDOW */}
            <div className={`flex-1 flex-col min-h-0 ${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex`}>
              <div className="bg-[rgb(var(--card-bg))] backdrop-blur-md border border-[rgb(var(--card-border))] flex-1 p-6 rounded-2xl overflow-y-auto shadow-lg flex flex-col">
                {!selectedUser ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-[rgb(var(--text-subtle))]">Select a user to start chatting</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 text-xl font-bold mb-4 border-b border-[rgb(var(--input-border))] pb-4 flex-shrink-0">
                      <button
                        onClick={() => { setSelectedUser(null); setMobileView('list'); }}
                        className="p-1 rounded-full hover:bg-[rgb(var(--input-bg))] transition"
                      >
                        <HiArrowLeft size={20} />
                      </button>
                      <img
                        src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${selectedUser.name}`}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <h2>{selectedUser.name}</h2>
                    </div>
                    <ul className="space-y-2 flex-1 overflow-y-auto pt-4 px-2">
                      {currentMessages.map((msg, i) => (
                        <li
                          key={msg._id || i}
                          className={`flex items-start group ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                          onTouchStart={() => handleTouchStart(msg._id)}
                          onTouchEnd={handleTouchEnd}>
                          <div className={`relative flex items-center gap-2 ${msg.senderId === user?._id ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* The Message Bubble */}
                            <div className={`p-3 rounded-lg max-w-xs md:max-w-md break-words shadow-md ${msg.senderId === user?._id
                              ? 'bg-gradient-to-r from-[rgb(var(--msg-sent-from))] to-[rgb(var(--msg-sent-to))] text-[rgb(var(--msg-sent-text))]'
                              : 'bg-[rgb(var(--msg-received-bg))] text-[rgb(var(--msg-received-text))]'
                              }`}>
                              {msg.message}
                            </div>

                            {/* Ellipsis button and Dropdown Menu */}
                            <div className="relative" ref={menuRef}>
                              <button
                                onClick={() => setOpenMenuMessageId(openMenuMessageId === msg._id ? null : msg._id)}
                                className="p-1 cursor-pointer rounded-full text-[rgb(var(--text-subtle))] opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <HiDotsVertical size={18} />
                              </button>

                              {openMenuMessageId === msg._id && (
    <div className={`absolute top-full mt-1 w-48 bg-[rgb(var(--card-bg))] backdrop-blur-md border border-[rgb(var(--card-border))] rounded-lg shadow-xl py-1 z-20 ${msg.senderId === user._id ? 'right-0' : 'left-0'}`}>
        {/* --- NEW "Copy" Button --- */}
        <button onClick={() => handleCopyMessage(msg.message)} className="w-full text-left px-3 py-2 text-sm text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--input-bg))]">
            Copy Message
        </button>

        {/* --- NEW "Forward" Button --- */}
        <button onClick={() => handleOpenForwardModal(msg)} className="w-full text-left px-3 py-2 text-sm text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--input-bg))]">
            Forward Message
        </button>
        
        <div className="border-t border-[rgb(var(--input-border))] my-1"></div>

        {/* --- Existing Delete Buttons --- */}
        <button onClick={() => handleOpenModal(msg._id, 'me')} className="w-full text-left px-3 py-2 text-sm text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--input-bg))]">
            Delete for Me
        </button>
        {msg.senderId === user._id && (
            <button onClick={() => handleOpenModal(msg._id, 'everyone')} className="w-full text-left px-3 py-2 text-sm text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--input-bg))]">
                Delete for Everyone
            </button>
        )}
    </div>
)}
                            </div>
                          </div>
                        </li>
                      ))}
                      <div ref={messagesEndRef} /> {/* to make chat scroll to boottom */}
                    </ul>
                  </>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="flex gap-3 flex-shrink-0 mt-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-[rgb(var(--input-bg))] backdrop-blur-md border border-[rgb(var(--input-border))] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-from))]"
                  placeholder={selectedUser ? `Message ${selectedUser.name}` : "Select a user to message"}
                  disabled={!selectedUser}
                />
                <button
                  type="submit"
                  className=" bg-gradient-to-r from-[rgb(var(--send-btn-from))] to-[rgb(var(--send-btn-to))] px-5 py-3 rounded-xl shadow-md hover:opacity-90 disabled:opacity-50 disabled:shadow-none flex items-center justify-center transition"
                  disabled={!selectedUser}
                >
                  <FiSend size={20} className="text-white" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default App;