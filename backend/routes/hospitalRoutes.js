const express = require("express");
const Hospital = require("../models/Hospital");
const Inventory = require("../models/Inventory");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ status: "OK", message: "Hospital route works" });
});

// GET ALL HOSPITALS
router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find().select("-password");
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REGISTER HOSPITAL
router.post("/register", async (req, res) => {
  const { name, email, password, city, state, pincode, type } = req.body;
  try {
    let hospital = await Hospital.findOne({ email });
    if (hospital) return res.status(400).json({ message: "Hospital already exists" });

    hospital = new Hospital({
      name, email, password, city, state, pincode, type
    });

    const salt = await bcrypt.genSalt(10);
    hospital.password = await bcrypt.hash(password, salt);
    await hospital.save();

    // Create empty inventory for this hospital
    const inventory = new Inventory({
      hospital_id: hospital._id,
      stock: { "A+": { units: 0 }, "A-": { units: 0 }, "B+": { units: 0 }, "B-": { units: 0 }, "AB+": { units: 0 }, "AB-": { units: 0 }, "O+": { units: 0 }, "O-": { units: 0 } }
    });
    await inventory.save();

    const payload = { id: hospital.id };
    jwt.sign(payload, process.env.JWT_SECRET || "devsecret", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, hospital: { id: hospital.id, name, email, verified: hospital.verified } });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN HOSPITAL
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let hospital = await Hospital.findOne({ email });
    if (!hospital) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const payload = { id: hospital.id };
    jwt.sign(payload, process.env.JWT_SECRET || "devsecret", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, hospital: { id: hospital.id, name: hospital.name, email, verified: hospital.verified } });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET LOGGED IN HOSPITAL PROFILE
router.get("/me", auth, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id).select("-password");
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
