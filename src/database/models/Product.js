const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  unit: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
  suplier: {
    type: String,
    required: true,
  },
});

const Product = new model("Product", productSchema);

module.exports = Product;
