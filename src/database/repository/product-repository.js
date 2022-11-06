const { STATUS_CODES, APIError } = require("../../helpers/AppError");

const Product = require("../models/Product");

class ProductRepository {
  async CreateProduct(object) {
    try {
      return await Product.create(object);
    } catch {
      throw new APIError(
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
      throw new APIError(
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
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find Product!"
      );
    }
  }

  async FindByCategory(category) {
    try {
      return await Product.find({ type: category });
    } catch {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Category"
      );
    }
  }

  async DeleteProduct(id) {
    try {
      return await Product.deleteOne({ _id: id });
    } catch {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to delete product"
      );
    }
  }

  async FindSelectedProducts(ids) {
    try {
      return await Product.find({ _id: { $in: ids } });
    } catch {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find product selected products"
      );
    }
  }
}
module.exports = ProductRepository;
