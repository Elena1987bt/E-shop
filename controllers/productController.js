const multer = require('multer');
const mongoose = require('mongoose');
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const AppError = require('../helpers/appError');

// CONFIGURATION OF MULTER
const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadError = new AppError(
      'Not an image! Please upload only images.',
      400
    );
    if (file.mimetype.startsWith('image')) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split('.')[0].split(' ').join();
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

exports.uploadOptions = multer({ storage: storage });

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(new AppError('No category found with that ID', 404));
    }
    const file = req.file;
    if (!file) return next(new AppError('No image found in the request', 404));

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const product = await Product.create({
      ...req.body,
      image: `${basePath}${fileName}`,
    });
    product.save();

    res.status(200).json({ status: 'success', data: product });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }
    res.status(200).json({ status: 'success', data: product });
  } catch (err) {
    next(err);
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return next(new AppError('Invalid Product ID', 404));
    }
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(new AppError('No category found with that ID', 404));
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }
    const file = req.file;
    let imagePath;
    if (file) {
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      imagePath = `${basePath}${fileName}`;
    } else {
      imagePath = product.image;
    }
    const newProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imagePath },
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: newProduct });
  } catch (err) {
    next(err);
  }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }
    res
      .status(204)
      .json({ status: 'success', message: 'Category deleted', data: null });
  } catch (err) {
    next(err);
  }
};

// STATISTICS
// COUNT DOCUMENTS
exports.countProducts = async (req, res, next) => {
  try {
    const countProducts = await Product.estimatedDocumentCount();
    res.status(200).json({ status: 'success', data: countProducts });
  } catch (err) {
    next(err);
  }
};

// GET FEATURED PRODUCTS
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const count = req.query.count ? req.query.count : 0;
    const featuredProducts = await Product.find({ isFeatured: true }).limit(
      count * 1
    );
    res.status(200).json({
      status: 'success',
      results: featuredProducts.length,
      data: featuredProducts,
    });
  } catch (err) {
    next(err);
  }
};

// GET FILTER PRODUCTS BY CATEGORY
exports.filterProducts = async (req, res, next) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(',') };
    }
    const filteredProducts = await Product.find(filter).populate('category');
    res.status(200).json({
      status: 'success',
      results: filteredProducts.length,
      data: filteredProducts,
    });
  } catch (err) {
    next(err);
  }
};

// UPLOAD GALLERY IMAGES
exports.updateGalleryImages = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return next(new AppError('Invalid Product ID', 404));
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!updatedProduct)
      return next(new AppError('The gallery can not be updated', 404));

    res.status(200).json({
      status: 'success',
      data: updatedProduct,
    });
  } catch (err) {
    next(err);
  }
};
