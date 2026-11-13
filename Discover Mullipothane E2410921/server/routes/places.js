const express = require("express");
const router = express.Router();
const Place = require("../models/Place");

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
}

router.get("/", async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    const filter = { active: true };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }

    let sortObj = { distanceKm: 1 };
    if (sort === "name") {
      sortObj = { name: 1 };
    } else if (sort === "distance") {
      sortObj = { distanceKm: 1 };
    }

    const places = await Place.find(filter).sort(sortObj);
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Place.distinct("category", { active: true });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/admin/all", requireAuth, async (req, res) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(place);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid place identifier" });
    }
    res.status(500).json({ error: "Failed to fetch place" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const place = new Place(req.body);
    await place.save();
    res.status(201).json(place);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: "Validation failed", details: messages });
    }
    res.status(500).json({ error: "Failed to create place" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(place);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: "Validation failed", details: messages });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid place identifier" });
    }
    res.status(500).json({ error: "Failed to update place" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json({ message: "Place deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid place identifier" });
    }
    res.status(500).json({ error: "Failed to delete place" });
  }
});

module.exports = router;
