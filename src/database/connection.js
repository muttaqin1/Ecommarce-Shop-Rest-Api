const mongoose = require("mongoose");

const {
  database: { mongo_uri },
} = require("../config");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connection = async () => {
  try {
    await mongoose.connect(mongo_uri, options);
    console.log("Databse connected!");
  } catch (e) {
    console.log("=============================ERROR=============================");
    console.log(e.message);
    process.exit(1);
  }
};

module.exports = connection;
