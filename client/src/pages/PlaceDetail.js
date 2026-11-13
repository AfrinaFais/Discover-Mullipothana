import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { ItineraryContext } from "../context/ItineraryContext";

const defaultIcon = L.divIcon({
  className: "",
  html: '<div style="width:24px;height:24px;background:#0f766e;border:2px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

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

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedMsg, setAddedMsg] = useState("");
  const { addToItinerary, itinerary } = useContext(ItineraryContext);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/places/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Place not found");
        return r.json();
      })
      .then((data) => {
        setPlace(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const isInPlan = itinerary.some((item) => item.placeId === id);

  const handleAddToPlan = () => {
    if (isInPlan) {
      setAddedMsg("This place is already in your day plan.");
    } else {
      addToItinerary(place);
      setAddedMsg("Added to your day plan!");
    }
    setTimeout(() => setAddedMsg(""), 2000);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>{error}</h3>
        <Link to="/catalogue" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Back to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        &larr; Back
      </button>

      <div className="place-detail-hero">
        {place.photos && place.photos.length > 0 ? (
          <img src={place.photos[0]} alt={place.name} />
        ) : (
          categoryIcons[place.category] || "\uD83C\uDF0D"
        )}
      </div>

      <div className="place-detail">
        <div className="place-detail-info">
          <h1>{place.name}</h1>
          <div className="place-detail-meta">
            <span className="meta-tag">{place.category}</span>
            <span className="meta-tag">{place.distanceKm} km</span>
            <span className="meta-tag">{place.visitDurationMin} min visit</span>
          </div>

          <div className="place-detail-section">
            <h3>Description</h3>
            <p>{place.description || "Information not yet available"}</p>
          </div>

          <div className="place-detail-section">
            <h3>Opening Hours</h3>
            <p>{place.openingHours || "Information not yet available"}</p>
          </div>

          <div className="place-detail-section">
            <h3>Entrance Fee</h3>
            <p>{place.entranceFee || "Information not yet available"}</p>
          </div>

          <div className="place-detail-section">
            <h3>Travel Tips</h3>
            <p>{place.tips || "Information not yet available"}</p>
          </div>

          {place.curatedReview && (
            <div className="place-detail-section">
              <h3>Visitor Notes</h3>
              <p style={{ fontStyle: "italic" }}>{place.curatedReview}</p>
            </div>
          )}

          <div className="place-detail-actions">
            <button className="btn btn-primary" onClick={handleAddToPlan}>
              {isInPlan ? "Already in Plan" : "Add to My Day Plan"}
            </button>
            <a
              href={`https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=14/${place.latitude}/${place.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Open in OSM
            </a>
          </div>

          {addedMsg && (
            <div className="alert alert-success" style={{ marginTop: "0.75rem" }}>
              {addedMsg}
            </div>
          )}
        </div>

        <div>
          {place.latitude && place.longitude && (
            <div className="place-detail-map">
              <MapContainer
                center={[place.latitude, place.longitude]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[place.latitude, place.longitude]} icon={defaultIcon}>
                  <Popup>{place.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          <div style={{ marginTop: "1rem", fontSize: "0.8125rem", color: "#64748b" }}>
            <p>
              Coordinates: {place.latitude}, {place.longitude}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
