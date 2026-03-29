const express = require("express");
const Donor = require("../models/Donor");

const router = express.Router();

// REGISTER DONOR
router.post("/register", async (req, res) => {
    const { name, blood_group, city, phone } = req.body;
    try {
        const donor = new Donor({
            name, blood_group, city, phone
        });

        await donor.save();

        res.json({ message: "Donor registered successfully", donor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL DONORS
router.get("/", async (req, res) => {
    try {
        const donors = await Donor.find().sort({ createdAt: -1 });
        res.json(donors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
