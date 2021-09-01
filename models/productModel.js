const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A product must have a description'],
  },
  richDescription: {
    type: String,
    default: ' ',
  },
  image: { type: String, default: ' ' },
  images: [{ type: String, default: ' ' }],
  brand: {
    type: String,
    default: ' ',
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'A product must belong to a category'],
  },
  countInStock: { type: Number, required: true, min: 0, max: 255 },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: { type: Date, default: Date.now },
});

productSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject();
  const { _id: id, ...result } = object;
  return { ...result, id };
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
