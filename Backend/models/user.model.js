import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({

  name: {

    type: String,

    required: true,

    trim: true,

  },

  username: {

    type: String,

    required: true,

    unique: true,

    trim: true,

    minlength: 3

  },

  email: {

    type: String,

    required: true,

    unique: true,

    trim: true,

    lowercase: true,

  },

  password: {

    type: String,

    required: true,

    minlength: 6

  },

  isVerified: {

    type: Boolean,

    default: false,

  },

  verificationToken: {

    type: String,

  },

  avatarSeed: {

    type: String,

    // Give new users a random avatar by default

    default: () => Math.random().toString(36).substring(7),

  },

  // --- NEW FIELDS ---

  dob: {

    type: Date,

  },

  gender: {

    type: String,

    enum: ['Male', 'Female', 'Other'], // Only allows these values

  },

  bio: {

    type: String,

    maxlength: 200,

  }

}, {

  timestamps: true,

});





const User = mongoose.model('User', userSchema);



export default User;

