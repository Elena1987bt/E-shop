const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../helpers/appError');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
};

exports.signUp = async (req, res, next) => {
  try {
    const user = await User.create({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 12),
    });
    user.save();

    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    // 1. Find user by email
    const user = await User.findOne({ email: req.body.email });
    // 2. Check if user exists
    if (!user) return next(new AppError('No user found with that email', 404));

    // 3. Check if password match
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      res.status(200).json({
        status: 'success',
        message: 'User Authenticated!',
        user: user.email,
        token,
      });
    } else {
      next(new AppError('Wrong password', 404));
    }
  } catch (err) {
    next(err);
  }
};

// STATISTICS
// COUNT DOCUMENTS
exports.countUsers = async (req, res, next) => {
  try {
    const countUsers = await User.estimatedDocumentCount();
    res.status(200).json({ status: 'success', data: countUsers });
  } catch (err) {
    next(err);
  }
};
