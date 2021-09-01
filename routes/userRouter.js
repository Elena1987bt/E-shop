const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.route('/').get(userController.getAllUsers);
router.route('/:id').get(userController.getUser);
//   .patch(productController.updateProduct)
//   .delete(productController.deleteProduct);

router.route('/login').post(userController.login);
router.route('/signup').post(userController.signUp);

router.get('/get/count', userController.countUsers);

module.exports = router;
