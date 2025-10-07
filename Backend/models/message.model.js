import mongoose from 'mongoose';



const messageSchema = new mongoose.Schema({

  senderId: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User", // This creates a relationship to the User model

    required: true,

  },

  recipientId: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true,

  },

  message: {

    type: String,

    required: true,

  },

  isRead: { // 👈 ADD THIS FIELD
    type: Boolean,
    default: false,
  },
  deletedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

}, {

  timestamps: true // Adds createdAt and updatedAt timestamps

});



const Message = mongoose.model('Message', messageSchema);



export default Message;

