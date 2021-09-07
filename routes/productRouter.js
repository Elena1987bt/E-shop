const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    productController.uploadOptions.single('image'),
    productController.createProduct
  );
router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    productController.uploadOptions.single('image'),
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

router.patch(
  '/gallery-images/:id',
  productController.uploadOptions.array('images', 10),
  productController.updateGalleryImages
);

router.get('/get/count', productController.countProducts);
router.get('/get/featuredProducts', productController.getFeaturedProducts);
router.get('/get/filterProducts', productController.filterProducts);
module.exports = router;
