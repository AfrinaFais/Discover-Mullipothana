const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Place name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Heritage",
        "Nature",
        "Religious",
        "Cultural",
        "Monument",
        "Scenic",
        "Tourist Attraction",
        "Lake/Bathing",
        "Bridge",
        "Viewpoint",
        "Local Dining",
      ],
    },
    distanceKm: {
      type: Number,
      required: [true, "Distance from home is required"],
      min: [0, "Distance cannot be negative"],
      max: [25, "Distance must be within 25 km of the home location"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [80, "Description must be at least 80 characters"],
    },
    openingHours: {
      type: String,
      required: [true, "Opening hours are required"],
    },
    visitDurationMin: {
      type: Number,
      required: [true, "Visit duration is required"],
      min: [10, "Minimum visit duration is 10 minutes"],
      max: [480, "Maximum visit duration is 480 minutes"],
    },
    entranceFee: {
      type: String,
      required: [true, "Entrance fee information is required"],
    },
    tips: {
      type: String,
      required: [true, "Travel tips are required"],
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
      min: [5.5, "Latitude must be between 5.5 and 10.0 for Sri Lanka"],
      max: [10.0, "Latitude must be between 5.5 and 10.0 for Sri Lanka"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
      min: [79.0, "Longitude must be between 79.0 and 82.5 for Sri Lanka"],
      max: [82.5, "Longitude must be between 79.0 and 82.5 for Sri Lanka"],
    },
    photos: {
      type: [String],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
    curatedReview: {
      type: String,
      default: "",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

placeSchema.index({ category: 1 });
placeSchema.index({ active: 1 });
placeSchema.index({ name: 1 });

module.exports = mongoose.model("Place", placeSchema);
