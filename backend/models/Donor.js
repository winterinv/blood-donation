const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    blood_group: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Donor", DonorSchema);
