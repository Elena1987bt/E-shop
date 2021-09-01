const Category = require('../models/CategoryModel');
const AppError = require('../helpers/appError');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);
    newCategory.save();

    res.status(201).json({ status: 'success', data: newCategory });
  } catch (err) {
    next(err);
  }
};
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new AppError('No category found with that ID', 404));
    }
    res.status(200).json({ status: 'success', data: category });
  } catch (err) {
    next(err);
  }
};
exports.updateCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!newCategory) {
      return next(new AppError('No category found with that ID', 404));
    }
    res.status(200).json({ status: 'success', data: newCategory });
  } catch (err) {
    next(err);
  }
};
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return next(new AppError('No category found with that ID', 404));
    }
    res
      .status(204)
      .json({ status: 'success', message: 'Category deleted', data: null });
  } catch (err) {
    next(err);
  }
};
