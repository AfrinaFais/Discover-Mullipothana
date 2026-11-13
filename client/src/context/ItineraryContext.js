import React, { createContext, useState, useEffect } from "react";

export const ItineraryContext = createContext();

export function ItineraryProvider({ children }) {
  const [itinerary, setItinerary] = useState(() => {
    try {
      const saved = sessionStorage.getItem("itinerary");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [dayStartTime, setDayStartTime] = useState(() => {
    try {
      const saved = sessionStorage.getItem("dayStartTime");
      return saved || "08:00";
    } catch {
      return "08:00";
    }
  });

  const [travelBufferMin, setTravelBufferMin] = useState(() => {
    try {
      const saved = sessionStorage.getItem("travelBufferMin");
      return saved ? parseInt(saved, 10) : 20;
    } catch {
      return 20;
    }
  });

  useEffect(() => {
    sessionStorage.setItem("itinerary", JSON.stringify(itinerary));
  }, [itinerary]);

  useEffect(() => {
    sessionStorage.setItem("dayStartTime", dayStartTime);
  }, [dayStartTime]);

  useEffect(() => {
    sessionStorage.setItem("travelBufferMin", String(travelBufferMin));
  }, [travelBufferMin]);

  const addToItinerary = (place) => {
    if (itinerary.some((item) => item.placeId === place._id)) return;
    setItinerary((prev) => [
      ...prev,
      {
        placeId: place._id,
        name: place.name,
        category: place.category,
        distanceKm: place.distanceKm,
        durationMin: place.visitDurationMin || 45,
        sequence: prev.length + 1,
        active: true,
      },
    ]);
  };

  const removeFromItinerary = (placeId) => {
    setItinerary((prev) =>
      prev
        .filter((item) => item.placeId !== placeId)
        .map((item, idx) => ({ ...item, sequence: idx + 1 }))
    );
  };

  const moveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= itinerary.length) return;
    const items = [...itinerary];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    setItinerary(items.map((item, idx) => ({ ...item, sequence: idx + 1 })));
  };

  const updateDuration = (placeId, duration) => {
    setItinerary((prev) =>
      prev.map((item) =>
        item.placeId === placeId ? { ...item, durationMin: duration } : item
      )
    );
  };

  const clearItinerary = () => {
    setItinerary([]);
  };

  return (
    <ItineraryContext.Provider
      value={{
        itinerary,
        dayStartTime,
        setDayStartTime,
        travelBufferMin,
        setTravelBufferMin,
        addToItinerary,
        removeFromItinerary,
        moveItem,
        updateDuration,
        clearItinerary,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
}
