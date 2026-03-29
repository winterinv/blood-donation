const express = require("express");
const Inventory = require("../models/Inventory");
const Request = require("../models/Request");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/create", auth, async (req, res) => {
  const { blood_group, units } = req.body;
  const from_hospital = req.user.id;

  try {
    const matches = await Inventory.find({
      [`stock.${blood_group}.units`]: { $gte: units }
    }).populate("hospital_id");

    const validMatches = matches.filter(
      (m) => m.hospital_id && m.hospital_id._id.toString() !== from_hospital
    );

    if (!validMatches.length) {
      return res.status(404).json({ message: "No hospitals with surplus found" });
    }

    const target = validMatches[0];

    const request = new Request({
      from_hospital,
      to_hospital: target.hospital_id._id,
      blood_group,
      units
    });

    await request.save();

    res.json({
      message: "Request sent successfully",
      target: target.hospital_id.name,
      request
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/my-requests", auth, async (req, res) => {
  try {
    const requests = await Request.find({
      to_hospital: req.user.id
    }).populate("from_hospital", "name city email pincode")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/sent-requests", auth, async (req, res) => {
  try {
    const requests = await Request.find({
      from_hospital: req.user.id
    }).populate("to_hospital", "name city email pincode")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/accept", auth, async (req, res) => {
  const { request_id } = req.body;
  try {
    const request = await Request.findById(request_id);
    if (!request) return res.status(404).json({ message: "Not found" });
    if (request.to_hospital.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = "ACCEPTED";
    await request.save();

    res.json({ message: "Request accepted", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
