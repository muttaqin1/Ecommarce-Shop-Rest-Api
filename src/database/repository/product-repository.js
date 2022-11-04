const { STATUS_CODES, APIError } = require("../../helpers/AppError");

const Product = require("../models/Product");

class ProductRepository {
  async CreateProduct(object) {
    try {
      return await Product.create(object);
    } catch {
      throw APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create Product!"
      );
    }
  }
  async Products() {
    try {
      return await Product.find();
    } catch {
      throw APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find Product!"
      );
    }
  }

  async FindById(id) {
    try {
      return await Product.findById(id);
    } catch {
      throw APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find Product!"
      );
    }
  }

  async FindByCategory(category) {
    try {
      return await ProductModel.find({ type: category });
    } catch {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Category"
      );
    }
  }
}
module.exports = ProductRepository;
