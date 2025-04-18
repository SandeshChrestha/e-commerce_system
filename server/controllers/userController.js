import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/email.js';
import generateOTP from '../utils/otpGenerator.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (!user.isVerified) {
      res.status(401);
      throw new Error('Please verify your email before logging in');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      message: error.message || 'Internal server error during login',
    });
  }
});

// @desc    Register a new user with OTP
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  const otp = generateOTP();
  const otpExpires = Date.now() + 10 * 60 * 1000;

  if (userExists && userExists.isVerified) {
    res.status(400);
    throw new Error('User already exists');
  }

  if (userExists) {
    userExists.name = name;
    userExists.password = password;
    userExists.otp = otp;
    userExists.otpExpires = otpExpires;
    await userExists.save();
  } else {
    await User.create({ name, email, password, otp, otpExpires });
  }

  const message = `Your OTP for verification is: ${otp}\nThis OTP will expire in 10 minutes.`;

  try {
    await sendEmail({
      email,
      subject: 'Your OTP for Account Verification',
      message,
      html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>
             <p>This OTP will expire in 10 minutes.</p>`,
    });

    res.status(201).json({
      success: true,
      message: 'OTP sent to email. Please verify to complete registration.',
      email,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Send OTP for verification
// @route   POST /api/users/send-otp
// @access  Public
const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists && userExists.isVerified) {
    res.status(400);
    throw new Error('User already verified');
  }

  const otp = generateOTP();
  const otpExpires = Date.now() + 10 * 60 * 1000;

  if (userExists) {
    userExists.otp = otp;
    userExists.otpExpires = otpExpires;
    await userExists.save();
  }

  const message = `Your OTP for verification is: ${otp}\nThis OTP will expire in 10 minutes.`;

  try {
    await sendEmail({
      email,
      subject: 'Your OTP for Account Verification',
      message,
      html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>
             <p>This OTP will expire in 10 minutes.</p>`,
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent to email',
    });
  } catch (error) {
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400);
      throw new Error('Email and OTP are required');
    }

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid OTP or expired');
    }

    // Don't clear OTP yet, just mark as verified
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({
      message: error.message || 'Internal server error during OTP verification',
    });
  }
});

// @desc    Forgot password - send reset OTP
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const otp = generateOTP();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  const message = `You are receiving this email because you (or someone else) has requested to reset your password. Your OTP is: ${otp}`;

  try {
    await sendEmail({
      email,
      subject: 'Password Reset OTP',
      message,
      html: `<p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
             <p>Your OTP is: <strong>${otp}</strong></p>
             <p>This OTP will expire in 10 minutes.</p>`,
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent to email',
    });
  } catch (error) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password with OTP
// @route   PUT /api/users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !password || !otp) {
      res.status(400);
      throw new Error('Email, OTP and password are required');
    }

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid OTP or expired');
    }

    // Set the new password and clear OTP only after successful password reset
    user.password = password;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    // Generate a new token for immediate login
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      }
    });
  } catch (error) {
    console.error('Password Reset Error:', error);
    res.status(500).json({
      message: error.message || 'Internal server error during password reset',
    });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
};