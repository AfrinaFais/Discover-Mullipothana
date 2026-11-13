import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ItineraryContext } from "../context/ItineraryContext";

function formatTime(baseMinutes) {
  const h = Math.floor(baseMinutes / 60) % 24;
  const m = baseMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseTimeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export default function DayPlan() {
  const {
    itinerary,
    dayStartTime,
    setDayStartTime,
    travelBufferMin,
    setTravelBufferMin,
    removeFromItinerary,
    moveItem,
    updateDuration,
    clearItinerary,
  } = useContext(ItineraryContext);

  const [confirmClear, setConfirmClear] = useState(false);

  const baseMinutes = parseTimeToMinutes(dayStartTime);

  let runningMinutes = baseMinutes;
  const schedule = itinerary.map((item) => {
    const startMin = runningMinutes;
    runningMinutes += item.durationMin + travelBufferMin;
    return {
      ...item,
      startTime: formatTime(startMin),
      endTime: formatTime(startMin + item.durationMin),
    };
  });

  const totalVisitMin = itinerary.reduce((sum, item) => sum + item.durationMin, 0);
  const totalBufferMin = itinerary.length > 0 ? (itinerary.length - 1) * travelBufferMin : 0;
  const totalMin = totalVisitMin + totalBufferMin;
  const totalHours = Math.floor(totalMin / 60);
  const totalRemainder = totalMin % 60;
  const exceedsWarning = totalMin > 720;

  const handleClear = () => {
    clearItinerary();
    setConfirmClear(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>My Day Plan</h2>

      {itinerary.length === 0 ? (
        <div className="empty-state">
          <h3>Your day plan is empty</h3>
          <p>Add places from the catalogue or place detail page.</p>
          <Link to="/catalogue" className="btn btn-primary">
            Browse Catalogue
          </Link>
        </div>
      ) : (
        <div className="itinerary-page">
          <div className="itinerary-list">
            {schedule.map((item, index) => (
              <div key={item.placeId} className="itinerary-item">
                <div className="itinerary-item-number">{index + 1}</div>
                <div className="itinerary-item-content">
                  <div className="itinerary-item-name">
                    <Link to={`/place/${item.placeId}`}>{item.name}</Link>
                  </div>
                  <div className="itinerary-item-time">
                    {item.startTime} &ndash; {item.endTime}
                  </div>
                  <div className="itinerary-item-meta">
                    <span>{item.category}</span>
                    <span>{item.distanceKm} km</span>
                    <span>
                      <input
                        type="number"
                        min="10"
                        max="480"
                        value={item.durationMin}
                        onChange={(e) =>
                          updateDuration(item.placeId, parseInt(e.target.value, 10) || 45)
                        }
                        style={{
                          width: "60px",
                          padding: "2px 4px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "4px",
                          fontSize: "0.8125rem",
                        }}
                      />{" "}
                      min
                    </span>
                  </div>
                </div>
                <div className="itinerary-item-actions">
                  <button
                    className="btn btn-small btn-outline"
                    onClick={() => moveItem(index, index - 1)}
                    disabled={index === 0}
                    title="Move up"
                  >
                    &#9650;
                  </button>
                  <button
                    className="btn btn-small btn-outline"
                    onClick={() => moveItem(index, index + 1)}
                    disabled={index === itinerary.length - 1}
                    title="Move down"
                  >
                    &#9660;
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => removeFromItinerary(item.placeId)}
                    title="Remove"
                  >
                    &#10005;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="itinerary-sidebar">
            <h3>Plan Summary</h3>
            <div className="time-inputs">
              <label>
                Day Start Time
                <input
                  type="time"
                  value={dayStartTime}
                  onChange={(e) => setDayStartTime(e.target.value)}
                />
              </label>
              <label>
                Travel Buffer (min)
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={travelBufferMin}
                  onChange={(e) =>
                    setTravelBufferMin(parseInt(e.target.value, 10) || 0)
                  }
                />
              </label>
            </div>

            <div className="itinerary-summary-row">
              <span>Stops</span>
              <span>{itinerary.length}</span>
            </div>
            <div className="itinerary-summary-row">
              <span>Total Visit Time</span>
              <span>{totalVisitMin} min</span>
            </div>
            <div className="itinerary-summary-row">
              <span>Total Buffer Time</span>
              <span>{totalBufferMin} min</span>
            </div>
            <div className="itinerary-summary-row total">
              <span>Total Day Time</span>
              <span>
                {totalHours}h {totalRemainder}m
              </span>
            </div>

            {exceedsWarning && (
              <div className="itinerary-warning">
                Warning: Your plan exceeds 12 hours. Consider reducing stops or durations.
              </div>
            )}

            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button
                className="btn btn-outline"
                onClick={() => window.print()}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Print Plan
              </button>
              {!confirmClear ? (
                <button
                  className="btn btn-danger"
                  onClick={() => setConfirmClear(true)}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Clear All
                </button>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn btn-danger"
                    onClick={handleClear}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    Confirm Clear
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setConfirmClear(false)}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
