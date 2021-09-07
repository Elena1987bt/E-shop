const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router
  .route('/')
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

router.route('/get/count').get(orderController.countOrders);
router.route('/get/totalSales').get(orderController.getTotalSales);
router.route('/get/userOrders/:userId').get(orderController.getUserOrders);

module.exports = router;
