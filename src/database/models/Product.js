const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: String,
  desc: String,
  banner: String,
  type: String,
  unit: Number,
  price: Number,
  available: Boolean,
  suplier: String,
});

const Product = new model("Product", productSchema);

module.exports = Product;
