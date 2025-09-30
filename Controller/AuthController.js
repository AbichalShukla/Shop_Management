const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendOTPEmail = require('../Utils/sendEmail'); // your email utility

// Step 1: Register user and send OTP
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified === true) {
        return res.status(400).json({ msg: 'User already exists' });
      } else {
        // User exists but not verified, resend OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        if (name) user.name = name;
        if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
        }
        await user.save();

        // Optionally, send OTP email here
        // await sendOTPEmail(email, otp);

        return res.json({ msg: 'OTP resent to your email', success: true, email: user.email });
      }
    }

    // Create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user = new User({ name, email, password: hashedPassword, otp });
    await user.save();

    // Send OTP email here
    // await sendOTPEmail(email, otp);

    res.json({ msg: 'OTP sent to your email', success: true, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Step 2: Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    // OTP matches, verify user
    user.otp = null;
    user.isVerified = true; // Optional: mark user as verified
    await user.save();

    // Generate JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    if (!user.isVerified) return res.status(400).json({ msg: 'User not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } ,success:true});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  getUser,
};
