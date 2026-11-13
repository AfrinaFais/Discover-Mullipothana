import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const categoryIcons = {
  Heritage: "\uD83C\uDFDB",
  Nature: "\uD83C\uDF33",
  Religious: "\u26EA",
  Cultural: "\uD83C\uDFAD",
  Monument: "\uD83C\uDFDB\uFE0F",
  Scenic: "\uD83C\uDF05",
  "Tourist Attraction": "\u2B50",
  "Lake/Bathing": "\uD83C\uDF0A",
  Bridge: "\uD83C\uDF09",
  Viewpoint: "\uD83D\uDC41",
  "Local Dining": "\uD83C\uDF7D",
};

export default function Home() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch("/api/places")
      .then((r) => r.json())
      .then(setPlaces)
      .catch(() => {});
  }, []);

  const featured = places.slice(0, 3);

  return (
    <div>
      <section className="hero">
        <h1>Discover Mullipothane</h1>
        <p>
          Your local day-visit planner for Trincomalee District. Explore verified
          attractions within 25 km &mdash; heritage sites, scenic tanks, bridges, and
          viewpoints.
        </p>
        <Link to="/catalogue" className="btn btn-hero">
          Browse Attractions
        </Link>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
          Featured Places
        </h2>
        <div className="places-grid">
          {featured.map((place) => (
            <Link key={place._id} to={`/place/${place._id}`} style={{ textDecoration: "none" }}>
              <div className="card place-card">
                <div className="place-card-image">
                  {place.photos && place.photos.length > 0 ? (
                    <img src={place.photos[0]} alt={place.name} />
                  ) : (
                    categoryIcons[place.category] || "\uD83C\uDF0D"
                  )}
                </div>
                <div className="place-card-body">
                  <span className="place-card-category">{place.category}</span>
                  <h3 className="place-card-name">{place.name}</h3>
                  <p className="place-card-distance">{place.distanceKm} km from home</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link to="/catalogue" className="btn btn-primary">
          View All {places.length} Places
        </Link>
      </section>
    </div>
  );
}
