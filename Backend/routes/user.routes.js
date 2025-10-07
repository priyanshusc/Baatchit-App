import express from 'express';

import protectRoute from '../middleware/protectRoute.js';

import User from '../models/user.model.js';
import Message from '../models/message.model.js';



const router = express.Router();



// ✅ Route to get the logged-in user's profile

router.get('/profile', protectRoute, (req, res) => {

  res.status(200).json(req.user);

});



// ✅ Route to get all other users

router.get('/', protectRoute, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const allOtherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password").lean();

    const usersWithLastMessageAndUnreadCount = await Promise.all( // 👈 RENAME
      allOtherUsers.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, recipientId: user._id },
            { senderId: user._id, recipientId: loggedInUserId },
          ],
        }).sort({ createdAt: -1 });

        // 👇 ADD THIS LOGIC
        const unreadCount = await Message.countDocuments({
          senderId: user._id,
          recipientId: loggedInUserId,
          isRead: false,
        });

        return {
          ...user,
          lastMessageTimestamp: lastMessage ? lastMessage.createdAt : new Date(0),
          unreadCount: unreadCount, // 👈 ADD THE COUNT
        };
      })
    );

    usersWithLastMessageAndUnreadCount.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp); // 👈 RENAME

    res.status(200).json(usersWithLastMessageAndUnreadCount); // 👈 RENAME

  } catch (error) {
    console.error("Error in getUsers route", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ NEW: Route to UPDATE the logged-in user's profile

router.put('/profile', protectRoute, async (req, res) => {

  try {

    const { name, dob, gender, bio, avatarSeed } = req.body;

    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(

      userId,

      { name, dob, gender, bio, avatarSeed },

      { new: true } // returns updated document

    ).select("-password");



    if (!updatedUser) {

      return res.status(404).json({ message: "User not found" });

    }



    res.status(200).json(updatedUser);

  } catch (error) {

    console.error("Error in updateUser route", error);

    res.status(500).json({ message: "Internal Server Error" });

  }

});



export default router;