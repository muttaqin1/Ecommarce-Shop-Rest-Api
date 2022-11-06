const { ProductRepository } = require("../database");
const {
  CreateProduct,
  Products,
  FindById,
  DeleteProduct,
  FindByCategory,
  FindSelectedProducts,
} = new ProductRepository();

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
    if (!product) throw new Error("unable to find product");
    res.status(200).json({
      Success: true,
      StatusCode: res.statusCode,
      product,
    });
  } catch (e) {
    next(e);
  }
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await DeleteProduct(id);
    res.status(200).json({
      Success: true,
      StatusCode: res.statusCode,
      Message: "product deleted!",
    });
  } catch (e) {
    next(e);
  }
};

const findByCategory = async (req, res, next) => {
  try {
    const products = await FindByCategory(req.params.type);
    if (!products) throw new Error("no products found");
    res.status(200).json({
      Success: true,
      StatusCode: res.statusCode,
      products,
    });
  } catch (e) {
    next(e);
  }
};
const findSelectedProducts = async (req, res, next) => {
  const { ids } = req.body;
  try {
    const products = await FindSelectedProducts(ids);
    res.status(200).json({
      Success: true,
      StatusCode: res.statusCode,
      products,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createProduct,
  getProducts,
  findProduct,
  deleteProduct,
  findByCategory,
  findSelectedProducts,
};
