import React, { useState, useEffect, useCallback } from "react";
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

export default function Catalogue() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("distance");

  const fetchPlaces = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search) params.set("search", search);
    params.set("sort", sort);

    fetch(`/api/places?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load catalogue");
        return r.json();
      })
      .then((data) => {
        setPlaces(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [category, search, sort]);

  useEffect(() => {
    const timer = setTimeout(fetchPlaces, 300);
    return () => clearTimeout(timer);
  }, [fetchPlaces]);

  return (
    <div>
      <div className="catalogue-header">
        <h2>Attraction Catalogue</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search places..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search places"
          />
        </div>
      </div>

      <div className="category-filters">
        <button
          className={`category-chip${category === "All" ? " active" : ""}`}
          onClick={() => setCategory("All")}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-chip${category === cat ? " active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="sort-controls">
        <label htmlFor="sort-select">Sort by:</label>
        <select
          id="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="distance">Distance (nearest first)</option>
          <option value="name">Name (A-Z)</option>
        </select>
        <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>
          {places.length} place{places.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}{" "}
          <button className="btn btn-small btn-outline" onClick={fetchPlaces}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && places.length === 0 && (
        <div className="empty-state">
          <h3>No places found</h3>
          <p>Try adjusting your search or clearing filters.</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {!loading && !error && places.length > 0 && (
        <div className="places-grid">
          {places.map((place) => (
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
      )}
    </div>
  );
}
