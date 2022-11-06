const Customer = require("../models/Customer");
const { APIError, STATUS_CODES } = require("../../helpers/AppError");
class CustomerRepository {
  async Create(object) {
    try {
      return await Customer.create(object);
    } catch {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create Customer!"
      );
    }
  }

  async FindById(id) {
    try {
      return await Customer.findById(id);
    } catch {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find Customer!"
      );
    }
  }
  async FindByEmail(email) {
    try {
      return await Customer.findOne({ email });
    } catch {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find Customer!"
      );
    }
  }
}

module.exports = CustomerRepository;
