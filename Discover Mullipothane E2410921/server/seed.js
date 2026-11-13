require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Place = require("./models/Place");
const User = require("./models/User");

const places = [
  {
    name: "Tewaram Kulam",
    category: "Tourist Attraction",
    distanceKm: 12,
    description:
      "Situated in the Mullipothana area, Trincomalee District, along the Habarana-Trincomalee route. Traditional rural water storage tank (kulam) collecting rainwater and spillover to support paddy cultivation. Surrounded by countryside vegetation; used by residents for water needs and evening relaxation.",
    openingHours: "Daylight hours (typical rural tank bund; confirm locally)",
    visitDurationMin: 45,
    entranceFee: "Free",
    tips: "Best in late afternoon for quiet views. Park considerately on the roadside; do not block farm access. Unfenced water - supervise children.",
    latitude: 8.449189904620521,
    longitude: 81.13626957657091,
    photos: ["/images/Tewaram-Kulam.jpeg"],
    active: true,
  },
  {
    name: "Statue of King Agbo II (Aggabodhi II)",
    category: "Monument",
    distanceKm: 12,
    description:
      "Memorial statue honouring King Aggabodhi II (604-614 AD), associated with agricultural expansion and major irrigation works including Kantale Wewa. Located along the bund of Kantale Lake, beneath a protective canopy, overlooking the reservoir he is celebrated for.",
    openingHours: "Outdoor landmark; generally accessible during daylight",
    visitDurationMin: 20,
    entranceFee: "Free (public landmark)",
    tips: "Combine with Kantale Tank viewpoint. Good photographic stop on the Habarana-Trincomalee highway. Allow time for safe parking on the bund road.",
    latitude: 8.364195835827735,
    longitude: 80.99557423638605,
    photos: ["/images/king-agbo-ii-statue.jpeg"],
    active: true,
  },
  {
    name: "Kanthale Lake Bathing Place",
    category: "Lake/Bathing",
    distanceKm: 13,
    description:
      "Designated accessible section along the embankment of Kantale Wewa where locals and travellers swim or refresh. Shady trees and wide lake views; roadside snacks nearby. Illustrates tank-side village culture.",
    openingHours: "Informal; typically daylight / warm afternoons",
    visitDurationMin: 60,
    entranceFee: "Free",
    tips: "SAFETY: swimming is unstructured and at own risk; depths and currents vary; no lifeguard assumed. Do not swim if weather is stormy. Respect local bathers. Parking along the bund - watch traffic.",
    latitude: 8.376156749988539,
    longitude: 80.99862655727513,
    photos: ["/images/Kanthale-Lake-Bathing-Place.jpeg"],
    active: true,
  },
  {
    name: "Kantale Tank (Kantale Wewa)",
    category: "Tourist Attraction",
    distanceKm: 13,
    description:
      "Massive man-made reservoir from the reign of King Aggabodhi II; irrigation and drinking-water source for parts of Trincomalee District. Expansive embankment with breezes and highway rest spots. Ancient hydraulic engineering landmark.",
    openingHours: "Outdoor; daylight recommended",
    visitDurationMin: 40,
    entranceFee: "Free (public tank bund)",
    tips: "Best for sweeping views rather than a single monument. Pair with the King Agbo II statue. Wear sun protection on the open bund.",
    latitude: 8.372978569281155,
    longitude: 80.98254954025312,
    photos: ["/images/Kantale-Wewa.jpeg"],
    active: true,
  },
  {
    name: "Parevi Pancha Wewa",
    category: "Scenic",
    distanceKm: 4,
    description:
      "Smaller irrigation lake in the Kantale area, feeding nearby paddy land. Quiet setting away from the main highway, with vegetation, countryside views, and birdlife. Popular for evenings and sunsets on the bund.",
    openingHours: "Daylight to early evening",
    visitDurationMin: 40,
    entranceFee: "Free",
    tips: "Best time: sunset. Low crowds. Bring insect repellent at dusk. Stay on the bund; agricultural land is working farmland.",
    latitude: 8.432840430129149,
    longitude: 81.03628072659147,
    photos: ["/images/Parevi-Pancha-Wewa.jpeg"],
    active: true,
  },
  {
    name: "Kinniya Bridge",
    category: "Bridge",
    distanceKm: 23,
    description:
      "Sri Lanka's longest bridge at 396 m (1,299 ft) over Koddiyar and Tambalagam Bay lagoon. Opened 2009 on the A15, replacing a ferry and linking Trincomalee with Kinniya and Muttur. Panoramic lagoon, mangroves, and fishing activity.",
    openingHours: "Public highway structure; 24-hour passage; stopping only where safe",
    visitDurationMin: 25,
    entranceFee: "Free",
    tips: "Photo stop only - do not stop on the carriageway. Use designated shoulders/viewpoints. Wind can be strong. 23 km from home; plan travel buffer in the itinerary.",
    latitude: 8.507408777813678,
    longitude: 81.19146773823711,
    photos: ["/images/Kinniya-Bridge.jpeg"],
    active: true,
  },
  {
    name: "Eachankulam Reservoir Viewpoint",
    category: "Viewpoint",
    distanceKm: 3.7,
    description:
      "Bund of Eachankulam tank offering elevated views of open water, forest, and rural landscape. Uncrowded; used for evening breezes, sunsets, and birdwatching. Photography and rest stop on inland routes.",
    openingHours: "Daylight to sunset",
    visitDurationMin: 35,
    entranceFee: "Free",
    tips: "Closest catalogue viewpoint (3.7 km). Ideal first or last stop in a day plan. Uneven bund surfaces - wear stable footwear.",
    latitude: 8.44549709246734,
    longitude: 81.04600040070737,
    photos: ["/images/Eachankulam-Reservoir-Viewpoint.jpeg"],
    active: true,
  },
  {
    name: "Galmetiyawa Wewa",
    category: "Nature",
    distanceKm: 9,
    description:
      "Traditional rural reservoir harvesting rainwater for paddy and farms. Lush greenery, forest patches, and quiet farmland. Evening walks on the bund, birdwatching, freshwater ecology.",
    openingHours: "Daylight; evenings popular locally",
    visitDurationMin: 40,
    entranceFee: "Free",
    tips: "Not a crowded tourist hub - keep noise down. Good nature category example for filters. Combine with nearer wewa stops to reduce driving.",
    latitude: 8.478122655663407,
    longitude: 81.05614664040928,
    photos: ["/images/Galmetiyawa-wewa.jpeg"],
    active: true,
  },
  {
    name: "Marble Beach Road Viewpoint",
    category: "Viewpoint",
    distanceKm: 25,
    description:
      "Elevated winding access road to Marble Beach, Trincomalee. Views of turquoise bay, forested hills, and harbour waters. Brief photo stop with ocean breeze; marble-like water reflection from above. At the 25 km boundary.",
    openingHours: "Daylight; road is a public access route",
    visitDurationMin: 20,
    entranceFee: "Free (roadside view)",
    tips: "Exactly at the 25 km limit. Stop only in safe pull-offs. This is a preview of Marble Beach, not the beach resort itself. Allow extra travel buffer.",
    latitude: 8.508988031177411,
    longitude: 81.20377629405937,
    photos: ["/images/marble-beach-road-viewpoint.jpeg"],
    active: true,
  },
  {
    name: "Marble Beach Road Lake",
    category: "Nature",
    distanceKm: 25,
    description:
      "Calm freshwater body/lagoon beside the Marble Beach access road, between forest and coastal hills. Mangrove vegetation; short breather before the bay. Water birds and forest wildlife.",
    openingHours: "Daylight",
    visitDurationMin: 25,
    entranceFee: "Free",
    tips: "Pair with the Marble Beach Road Viewpoint in the same itinerary segment. Do not disturb nesting birds. 25 km limit applies. Soft roadside edges possible in wet weather.",
    latitude: 8.509854434398378,
    longitude: 81.20088654988159,
    photos: ["/images/Marble-Beach-Road-Lake.jpeg"],
    active: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/discover_mullipothane"
    );
    console.log("Connected to MongoDB");

    await Place.deleteMany({});
    console.log("Cleared existing places");

    await Place.insertMany(places);
    console.log(`Seeded ${places.length} places`);

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    await User.deleteMany({});
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      username: adminUsername,
      passwordHash,
      role: "admin",
    });
    console.log(`Admin user '${adminUsername}' created`);

    await mongoose.disconnect();
    console.log("Done. Disconnected from MongoDB.");
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
