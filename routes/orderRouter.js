const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router
  .route('/')
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);
// router
//   .route('/:id')
//   .get(productController.getProduct)
//   .patch(productController.updateProduct)
//   .delete(productController.deleteProduct);

module.exports = router;
