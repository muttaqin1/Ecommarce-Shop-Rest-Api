module.exports = {
  environment: process.env.NODE_ENV,
  server: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
  database: {
    mongo_uri: `${process.env.MONGO_URI}/ecommarce-shop`,
  },
  cookie: {
    Name: "Auth",
    expiry: 1000 * 60 * 60 * 24,
    secret: process.env.COOKIE_SECRET,
  },
  jwt: {
    secretKey:process.env.JWT_SECRET,
    exp:1000 * 60 * 60 * 24,
  },
};
