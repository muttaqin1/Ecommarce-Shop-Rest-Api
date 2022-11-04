const express = require("express");
const path = require("path");
const morgan = require("morgan");
const { environment } = require("./config");
const { product } = require("./routers");
const app = express();
const errorHandlers = require("./helpers/errorHandlers");
const expressMiddlewares = [
  express.json({ limit: "1mb" }),
  express.urlencoded({ extended: true, limit: "1mb" }),
];
if (environment === "development") expressMiddlewares.push(morgan("dev"));
app.use(expressMiddlewares);

app.use("/api", product);


app.use(errorHandlers)
module.exports = app;
