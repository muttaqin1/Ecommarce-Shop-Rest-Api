const { Schema, model } = require("mongoose");

const addressSchema = new Schema({
  street: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
}, {
  timestamps:true
});

module.exports = new model("Address", addressSchema);
