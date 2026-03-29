const express = require("express");
const Inventory = require("../models/Inventory");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/:hospitalId", async (req, res) => {
  try {
    const inventory = await Inventory.findOne({
      hospital_id: req.params.hospitalId
    });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/update", auth, async (req, res) => {
  const { blood_group, units } = req.body;
  try {
    const inventory = await Inventory.findOne({
      hospital_id: req.user.id
    });

    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    // Assuming stock is an object like {"O+": {units: 10}}
    if (inventory.stock[blood_group] && inventory.stock[blood_group].units !== undefined) {
      inventory.stock[blood_group].units = units;
    } else {
      inventory.stock[blood_group] = { units };
    }

    // markModified is important for nested objects in mongoose:
    inventory.markModified("stock");
    await inventory.save();

    res.json({ message: "Updated", inventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
