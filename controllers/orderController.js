const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const OrderItem = require('../models/order-itemModel');

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name')
      .sort({ dateOrdered: -1 });
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: orders,
    });
  } catch (err) {
    next();
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    console.log(req.body);
    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem.id;
      })
    );
    const orderItemsIdsResolved = await orderItemsIds;

    // Calculate total prices
    const totalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          'product'
        );

        console.log(orderItem);
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );
    console.log(totalPrices);
    // Sum total prices
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    const order = await Order.create({
      ...req.body,
      orderItems: orderItemsIdsResolved,
      totalPrice: totalPrice,
    });
    order.save();

    res.status(200).json({ status: 'success', data: order });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name')
      .populate({
        path: 'orderItems',
        populate: { path: 'product', populate: 'category' },
      });
    if (!order) {
      return next(new AppError('No category found with that ID', 404));
    }
    res.status(200).json({ status: 'success', data: order });
  } catch (err) {
    next(err);
  }
};
exports.updateOrder = async (req, res, next) => {
  try {
    const newOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!newOrder) {
      return next(new AppError('No order found with that ID', 404));
    }
    res.status(200).json({ status: 'success', data: newOrder });
  } catch (err) {
    next(err);
  }
};
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return next(new AppError('No order found with that ID', 404));
    } else {
      await order.orderItems.map(async (orderItem) => {
        await OrderItem.findByIdAndDelete(orderItem);
      });
    }
    res
      .status(204)
      .json({ status: 'success', message: 'Order deleted', data: null });
  } catch (err) {
    next(err);
  }
};

// STATISTICS
// COUNT ORDERS
exports.countOrders = async (req, res, next) => {
  try {
    const countOrders = await Order.estimatedDocumentCount();
    res.status(200).json({ status: 'success', data: countOrders });
  } catch (err) {
    next(err);
  }
};

// GET TOTAL SALES
exports.getTotalSales = async (req, res, next) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
  ]);

  if (!totalSales) {
    return next('The order sales cannot be generated', 404);
  }

  res.status(200).json({ totalSales: totalSales.pop().totalSales });
};

// GET USER ORDERS
exports.getUserOrders = async (req, res, next) => {
  const userOrderList = await Order.find({ user: req.params.userId })
    .populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        populate: 'category',
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
};
