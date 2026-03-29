const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  hospital_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },
  stock: Object
});

module.exports = mongoose.model("Inventory", InventorySchema);
