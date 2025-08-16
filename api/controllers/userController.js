const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password field
    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};

exports.signup = async (req, res) => {
  try {
    // 1. Check if email exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // 2. Hash password
    const hash = await bcrypt.hash(req.body.password, 10);

    // 3. Create user
    const user = new User({
      email: req.body.email,
      password: hash,
    });

    // 4. Save to DB
    const savedUser = await user.save();

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        userId: savedUser._id,
        email: savedUser.email,
      },
      process.env.JWT_SECRET, // store secret in .env
      { expiresIn: '1h' }
    );

    // 6. Send response with token
    res.status(201).json({
      message: 'User created successfully',
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};

exports.login = async (req, res) => {
  try {
    // 1. Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Auth failed' });
    }

    // 2. Compare hashed passwords
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Auth failed' });
    }

    // 3. Generate a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET, // store your secret in .env
      { expiresIn: '1h' }
    );

    // 4. Send success response
    res.status(200).json({
      message: 'Login successful',
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }
    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
};
