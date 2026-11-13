import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) {
          navigate("/admin/login");
        } else {
          setAuthChecked(true);
          fetchPlaces();
        }
      })
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  const fetchPlaces = () => {
    fetch("/api/places/admin/all", { credentials: "include" })
      .then((r) => {
        if (r.status === 401) {
          navigate("/admin/login");
          return;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setPlaces(data);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/places/${deleteTarget._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setPlaces((prev) => prev.filter((p) => p._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch {}
    setDeleteLoading(false);
  };

  if (!authChecked) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <Link to="/admin/places/new" className="btn btn-primary">
          + Add New Place
        </Link>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Distance</th>
                <th>Active</th>
                <th>Coords</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <tr key={place._id} className={!place.active ? "inactive" : ""}>
                  <td>
                    <Link to={`/place/${place._id}`} style={{ color: "#0f766e", fontWeight: 500 }}>
                      {place.name}
                    </Link>
                  </td>
                  <td>{place.category}</td>
                  <td>{place.distanceKm} km</td>
                  <td>{place.active ? "\u2705" : "\u274C"}</td>
                  <td>
                    {place.latitude && place.longitude ? (
                      "\u2705"
                    ) : (
                      <span className="flag">Missing</span>
                    )}
                  </td>
                  <td>
                    {place.photos && place.photos.length > 0 ? (
                      "\u2705"
                    ) : (
                      <span className="flag">No photo</span>
                    )}
                  </td>
                  <td>
                    <div className="actions">
                      <Link to={`/admin/places/${place._id}/edit`} className="btn btn-small btn-outline">
                        Edit
                      </Link>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => setDeleteTarget(place)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Place</h3>
            <p>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This
              action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
