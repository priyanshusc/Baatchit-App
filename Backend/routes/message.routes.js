import express from 'express';

import protectRoute from '../middleware/protectRoute.js';

import Message from '../models/message.model.js';
import { decrypt } from '../utils/crypto.js';



const router = express.Router();



// Route to get messages between two users

router.get('/:id', protectRoute, async (req, res) => {

  try {

    const { id: userToChatId } = req.params;

    const senderId = req.user._id;



    // Find the conversation

    const conversation = await Message.find({

      $or: [

        { senderId: senderId, recipientId: userToChatId },

        { senderId: userToChatId, recipientId: senderId },

      ],
      deletedBy: { $ne: senderId },

    }).sort({ createdAt: 1 }); // Sort by creation time

    const decryptedConversation = conversation.map((msg) => {
      return {
        ...msg.toObject(), // Convert Mongoose doc to a plain object
        message: decrypt(msg.message), // Decrypt the message content
      };
    });

    res.status(200).json(decryptedConversation); // 3. SEND THE DECRYPTED DATA



  } catch (error) {

    console.error("Error in getMessages route", error);

    res.status(500).json({ message: "Internal Server Error" });

  }

});

router.post('/read/:id', protectRoute, async (req, res) => {
    try {
        const { id: partnerId } = req.params;
        const userId = req.user._id;

        // Update all messages from the partner to the current user to be 'isRead: true'
        await Message.updateMany(
            { senderId: partnerId, recipientId: userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ message: "Messages marked as read" });

    } catch (error) {
        console.error("Error in mark as read route", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/delete/:id', protectRoute, async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        if (message.senderId.toString() !== userId.toString() && message.recipientId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        await Message.updateOne({ _id: messageId }, { $addToSet: { deletedBy: userId } });
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error in delete message route", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete('/:id', protectRoute, async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const userId = req.user._id;
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only delete messages you have sent." });
        }
        await Message.findByIdAndDelete(messageId);
        res.status(200).json({ message: "Message deleted for everyone" });
    } catch (error) {
        console.error("Error in delete for everyone route", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



export default router;