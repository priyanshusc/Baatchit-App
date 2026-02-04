import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();
router.post('/signup', async (req, res) => {
  let newUser;

  try {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      verificationToken: verificationToken,
    });

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

    res.status(201).json({ message: "User created successfully! Please check your email." });

  } catch (error) {
    console.error("Error in signup route:", error);

    if (newUser && newUser._id) {
        await User.findByIdAndDelete(newUser._id);
        console.log("Rolled back: User deleted because email failed.");
    }

    res.status(500).json({ message: "Failed to send verification email. Please try again." });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
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

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({ message: "Email verified successfully! You can now log in." });

  } catch (error) {
    console.error("Error in verification route", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;