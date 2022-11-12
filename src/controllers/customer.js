const { CustomerRepository } = require("../database");
const {
  UnauthorizationError,
  BadRequestError,
} = require("../helpers/AppError");
const ApiResponse = require("../helpers/ApiResponse");
const customerRepository = new CustomerRepository();

const addNewAddress = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      id: req.user._id,
    };
    const updatedCustomer = await customerRepository.CreateAddress(data);
    if (!updatedCustomer)
      throw new BadRequestError("failed to update Customer!");

    new ApiResponse(res).status(200).data({ updatedCustomer }).send();
  } catch (e) {
    next(e);
  }
};

const getProfile = async (req, res, next) => {
  const { _id } = req.user;
  const profile = await customerRepository.FindById(_id);
  new ApiResponse(res).status(200).data({ profile }).send();
};
const addToCart = async (req, res, next) => {
  const data = {
    id: req.user._id,
    ...req.body,
  };
  try {
    const updatedCart = await customerRepository.AddToCart(data);
    new ApiResponse(res).status(200).data({ cart:updatedCart.cart }).send();
  } catch (e) {
    next(e);
  }
};

const removeToCart = async (req, res, next) => {
  try {
   const updatedCart= await customerRepository.RemoveToCart(req.user._id, req.params.productId);
    new ApiResponse(res).status(200).data({cart:updatedCart.cart}).send();
  } catch (e) {
    next(e);
  }
};
module.exports = {

  addNewAddress,
  getProfile,
  addToCart,
  removeToCart,
};
