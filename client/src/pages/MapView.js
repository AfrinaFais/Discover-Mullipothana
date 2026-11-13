import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { ItineraryContext } from "../context/ItineraryContext";

const categoryColors = {
  Heritage: "#7c3aed",
  Nature: "#16a34a",
  Religious: "#d97706",
  Cultural: "#ec4899",
  Monument: "#6366f1",
  Scenic: "#f59e0b",
  "Tourist Attraction": "#0ea5e9",
  "Lake/Bathing": "#06b6d4",
  Bridge: "#8b5cf6",
  Viewpoint: "#10b981",
  "Local Dining": "#ef4444",
};

function createColoredIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

const CATEGORIES = [
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
];

export default function MapView() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const { itinerary } = useContext(ItineraryContext);

  useEffect(() => {
    fetch("/api/places")
      .then((r) => r.json())
      .then((data) => {
        setPlaces(data.filter((p) => p.latitude && p.longitude));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    category === "All" ? places : places.filter((p) => p.category === category);

  const center =
    filtered.length > 0
      ? [
          filtered.reduce((sum, p) => sum + p.latitude, 0) / filtered.length,
          filtered.reduce((sum, p) => sum + p.longitude, 0) / filtered.length,
        ]
      : [8.05, 80.98];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="map-page">
      <div className="map-sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <strong>Map Explorer</strong>
          <div className="category-filters" style={{ marginBottom: 0 }}>
            <button
              className={`category-chip${category === "All" ? " active" : ""}`}
              onClick={() => setCategory("All")}
            >
              All
            </button>
            {CATEGORIES.map((cat) =>
              places.some((p) => p.category === cat) ? (
                <button
                  key={cat}
                  className={`category-chip${category === cat ? " active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ) : null
            )}
          </div>
        </div>
        <div className="map-legend">
          {CATEGORIES.map((cat) =>
            places.some((p) => p.category === cat) ? (
              <span key={cat} className="legend-item">
                <span
                  className="legend-dot"
                  style={{ background: categoryColors[cat] || "#666" }}
                ></span>
                {cat}
              </span>
            ) : null
          )}
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={center}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((place) => (
            <Marker
              key={place._id}
              position={[place.latitude, place.longitude]}
              icon={createColoredIcon(categoryColors[place.category] || "#666")}
            >
              <Popup>
                <div>
                  <h4>{place.name}</h4>
                  <p>
                    {place.category} &bull; {place.distanceKm} km
                  </p>
                  <Link
                    to={`/place/${place._id}`}
                    style={{ color: "#0f766e", fontWeight: 600, fontSize: "0.8125rem" }}
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
