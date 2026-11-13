import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

const initialForm = {
  name: "",
  category: "Scenic",
  distanceKm: "",
  description: "",
  openingHours: "",
  visitDurationMin: 45,
  entranceFee: "Free",
  tips: "",
  latitude: "",
  longitude: "",
  active: true,
  curatedReview: "",
  adminNotes: "",
};

export default function AdminPlaceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    fetch(`/api/places/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Place not found");
        return r.json();
      })
      .then((data) => {
        setForm({
          name: data.name || "",
          category: data.category || "Scenic",
          distanceKm: data.distanceKm || "",
          description: data.description || "",
          openingHours: data.openingHours || "",
          visitDurationMin: data.visitDurationMin || 45,
          entranceFee: data.entranceFee || "Free",
          tips: data.tips || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
          active: data.active !== false,
          curatedReview: data.curatedReview || "",
          adminNotes: data.adminNotes || "",
        });
        setFetchLoading(false);
      })
      .catch(() => {
        navigate("/admin");
      });
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);
    setLoading(true);

    const payload = {
      ...form,
      distanceKm: parseFloat(form.distanceKm),
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      visitDurationMin: parseInt(form.visitDurationMin, 10),
    };

    const url = isEditing ? `/api/places/${id}` : "/api/places";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setErrors(data.details);
        } else {
          setErrors([data.error || "Save failed"]);
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate("/admin"), 1500);
    } catch {
      setErrors(["Network error. Please try again."]);
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-form-page">
      <h2>{isEditing ? "Edit Place" : "Add New Place"}</h2>

      {errors.length > 0 && (
        <div className="alert alert-error">
          {errors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          Place saved successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="distanceKm">Distance from Home (km, 0-25) *</label>
          <input
            id="distanceKm"
            name="distanceKm"
            type="number"
            min="0"
            max="25"
            step="0.1"
            value={form.distanceKm}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description * (min 80 characters)</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            minLength="80"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="openingHours">Opening Hours *</label>
          <input
            id="openingHours"
            name="openingHours"
            value={form.openingHours}
            onChange={handleChange}
            required
            placeholder="e.g. Daily 06:00-18:00 or Daylight hours"
          />
        </div>

        <div className="form-group">
          <label htmlFor="visitDurationMin">Visit Duration (minutes, 10-480) *</label>
          <input
            id="visitDurationMin"
            name="visitDurationMin"
            type="number"
            min="10"
            max="480"
            value={form.visitDurationMin}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="entranceFee">Entrance Fee *</label>
          <input
            id="entranceFee"
            name="entranceFee"
            value={form.entranceFee}
            onChange={handleChange}
            required
            placeholder="Free, N/A, or LKR amount"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tips">Travel Tips *</label>
          <textarea
            id="tips"
            name="tips"
            value={form.tips}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Parking, best time to visit, safety cautions"
          />
        </div>

        <div className="form-group">
          <label htmlFor="latitude">Latitude (5.5 - 10.0) *</label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            min="5.5"
            max="10.0"
            step="any"
            value={form.latitude}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Longitude (79.0 - 82.5) *</label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            min="79.0"
            max="82.5"
            step="any"
            value={form.longitude}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="curatedReview">Curated Review (optional)</label>
          <textarea
            id="curatedReview"
            name="curatedReview"
            value={form.curatedReview}
            onChange={handleChange}
            rows="2"
            placeholder="Optional curated visitor notes"
          />
        </div>

        <div className="form-group">
          <label htmlFor="adminNotes">Admin Notes (not public)</label>
          <textarea
            id="adminNotes"
            name="adminNotes"
            value={form.adminNotes}
            onChange={handleChange}
            rows="2"
            placeholder="Internal notes only"
          />
        </div>

        <div className="form-group">
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Active (visible to tourists)
          </label>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading || success}>
            {loading ? "Saving..." : isEditing ? "Update Place" : "Create Place"}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/admin")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
