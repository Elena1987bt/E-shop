const Order = require('../models/OrderModel');

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(400).json({
      error: err,
      status: 'fail',
    });
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    user.save();

    res.status(200).json({ status: 'success', data: order });
  } catch (err) {
    res.status(400).json({
      error: err,
      status: 'fail',
    });
  }
};
