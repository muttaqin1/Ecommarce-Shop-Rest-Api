const express = require("express");
const cookieParser = require("cookie-parser");

const {
  cookie: { secret },
} = require("../config");

const { environment } = require("../config");
const expressMiddlewares = [
  express.json({ limit: "1mb" }),
  express.urlencoded({ extended: true, limit: "1mb" }),
  cookieParser(secret),
];
if (environment === "development")
  expressMiddlewares.push(require("morgan")("dev"));

module.exports = {
  expressMiddlewares,
};
