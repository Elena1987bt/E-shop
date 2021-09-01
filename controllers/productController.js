const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const AppError = require('../helpers/appError');

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
    const product = await Product.create(req.body);
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
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(new AppError('No category found with that ID', 404));
    }
    const newProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }
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
