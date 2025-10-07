import express from 'express';

import bcrypt from 'bcryptjs';

import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';

import sendEmail from '../utils/sendEmail.js';



const router = express.Router();



// --- SIGNUP Route ---

router.post('/signup', async (req, res) => {

  try {

    const { name, username, email, password } = req.body;



    // Check if user already exists

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {

      return res.status(400).json({ message: "Username or email already exists." });

    }



    // Hash the password

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);



    const verificationToken = crypto.randomBytes(32).toString('hex');

    console.log("Token CREATED during signup:", verificationToken);



    // Create a new user instance

    const newUser = new User({

      name,

      username,

      email,

      password: hashedPassword,

      verificationToken: verificationToken,

    });



    // Save the user to the database

    await newUser.save();



    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    const message = `

      <h1>Welcome to Baatchit!</h1>

      <p>Please click the link below to verify your email address:</p>

      <a href="${verificationUrl}" target="_blank">Verify Your Email</a>

    `;



    await sendEmail({

      email: newUser.email,

      subject: 'Baatchit Email Verification',

      html: message,

    });





    res.status(201).json({ message: "User created successfully!" });



  } catch (error) {

    console.error("Error in signup route", error);

    res.status(500).json({ message: "Internal Server Error" });

  }

});



// --- NEW LOGIN Route ---

router.post('/login', async (req, res) => {

  try {

    const { username, password } = req.body;



    // Find the user by username

    const user = await User.findOne({ username });

    if (!user) {

      return res.status(400).json({ message: "Invalid username or password." });

    }



    // Compare the submitted password with the hashed password in the database

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(400).json({ message: "Invalid username or password." });

    }



    // If credentials are correct, create a JWT

    const payload = {

      user: {

        id: user.id

      }

    };



    jwt.sign(

      payload,

      process.env.JWT_SECRET, // Your secret key from the .env file

      { expiresIn: '1h' }, // Token expires in 1 hour

      (err, token) => {

        if (err) throw err;

        res.status(200).json({ token });

      }

    );



  } catch (error) {

    console.error("Error in login route", error);

    res.status(500).json({ message: "Internal Server Error" });

  }

});



router.get('/verify/:token', async (req, res) => {

  try {

    const { token } = req.params;

    console.log("Token RECEIVED for verification:", token);



    // Find the user with the given verification token

    const user = await User.findOne({ verificationToken: token });



    if (!user) {

      return res.status(400).json({ message: "Invalid verification token." });

    }



    // Mark the user as verified and remove the token

    user.isVerified = true;

    user.verificationToken = undefined; // or null

    await user.save();



    res.status(200).json({ message: "Email verified successfully! You can now log in." });



  } catch (error) {

    console.error("Error in verification route", error);

    res.status(500).json({ message: "Internal Server Error" });

  }

});





export default router;