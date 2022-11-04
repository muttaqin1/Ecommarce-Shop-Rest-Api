const { ProductRepository } = require("../database");
const { CreateProduct, Products, FindById } = new ProductRepository();

const createProduct = async (req, res, next) => {
  try {
    const product = await CreateProduct(req.body);
    res.status(200).json({
      Success: true,
      StatusCode: res.statusCode,
      product,
    });
  } catch (e) {
    next(e);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Products();
    res.status(200).json({
      Success: true,
      StatusCode: res.statusCode,
      products,
    });
  } catch (e) {
    next(e);
  }
};

const findProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await FindById(id);
    res.status(200).json({
      Success: true,
      StatusCode: res.statusCode,
      product,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createProduct,
  getProducts,
  findProduct,
};
