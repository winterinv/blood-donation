const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: String,
  state: String,
  pincode: String,
  type: String,
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model("Hospital", HospitalSchema);
