module.exports = {
  environment: process.env.NODE_ENV,
  server: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
  database: {
    mongo_uri: `${process.env.MONGO_URI}/ecommarce-shop`,
  },
};
