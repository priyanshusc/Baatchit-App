import express from 'express';

import http from 'http';

import { Server } from 'socket.io';

import cors from 'cors';

import dotenv from 'dotenv';

import jwt from 'jsonwebtoken';

import authRoutes from './routes/auth.routes.js';

import userRoutes from './routes/user.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';

import Message from './models/message.model.js';

import messageRoutes from './routes/message.routes.js';
import { encrypt } from './utils/crypto.js';



dotenv.config();



// --- App & Server Setup ---

const app = express();

const server = http.createServer(app);

const io = new Server(server, {

  cors: {

    origin: "*",

    methods: ["GET", "POST"]

  }

});



const PORT = process.env.PORT || 5000;

const userSocketMap = {}; // Maps userId to socket.id



// --- Middleware ---

app.use(cors());

app.use(express.json());

// ADD THIS "PAUSE SWITCH" MIDDLEWARE
app.use((req, res, next) => {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return res.status(503).json({ 
      message: "This application is under maintenance. Please check back later." 
    });
  }
  next();
});



// --- Routes ---

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/messages', messageRoutes);



// --- Socket.IO Connection Logic ---

io.on('connection', (socket) => {

  try {

    const token = socket.handshake.auth.token;

    if (!token) throw new Error("Authentication error");



    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) throw new Error("Authentication error");



    const userId = decoded.user.id;

    userSocketMap[userId] = socket.id;



    console.log(`User connected: ${userId} with socket ID: ${socket.id}`);



    // --- NEW: Broadcast the updated list of online users ---

    io.emit('getOnlineUsers', Object.keys(userSocketMap));



    // --- Listen for private messages ---

    socket.on('privateMessage', async ({ recipientId, message }) => {

      try {

        // Save the message to the database

         const newMessage = new Message({
      senderId: userId,
      recipientId: recipientId,
      message: encrypt(message), // 2. MODIFY THIS LINE
    });
    await newMessage.save();



        // Send the message in real-time to the recipient if they are online

        const recipientSocketId = userSocketMap[recipientId];

        if (recipientSocketId) {

          io.to(recipientSocketId).emit('privateMessage', {

            senderId: userId,

            message: message,

          });

        }

      } catch (error) {

        console.log("Error handling private message:", error);

      }

    });



    // --- On disconnect ---

    socket.on('disconnect', () => {

      delete userSocketMap[userId];

      console.log(`User disconnected: ${userId}`);

      // Broadcast updated list after disconnect

      io.emit('getOnlineUsers', Object.keys(userSocketMap));

    });



  } catch (error) {

    console.log("Socket connection error:", error.message);

    socket.disconnect(true);

  }

});



// --- Start Server ---

server.listen(PORT, () => {

  connectToMongoDB();

  console.log(`Server is listening on port ${PORT}`);

});