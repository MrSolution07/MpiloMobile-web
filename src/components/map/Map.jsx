import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, useMap } from "react-leaflet";

const getMapCenter = (locations) => {
  const entries = Object.values(locations);
  if (entries.length === 0) return { lat: 0, lng: 0 };

  const avgLat =
    entries.reduce((sum, loc) => sum + loc.lat, 0) / entries.length;
  const avgLng =
    entries.reduce((sum, loc) => sum + loc.lng, 0) / entries.length;

  return { lat: avgLat, lng: avgLng };
};

const FitBounds = (bounds) => {
  const map = useMap();
  map.fitBounds(bounds);
  return null;
};

function Map() {
  const [time, setTime] = useState(() => new Date());
  const [positions, setPositions] = useState({
    clinic_1: { lat: -25.748, lng: 28.229 },
    clinic_2: { lat: -25.746, lng: 28.221 },
    clinic_3: { lat: -25.745, lng: 28.228 },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 10 * 1000); // update every 10s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setPositions((prev) => {
          const updated = { ...prev };

          for (const key in updated) {
            updated[key] = {
              lat: updated[key].lat + (Math.random() - 0.5) * 0.0005,
              lng: updated[key].lng + (Math.random() - 0.5) * 0.0005,
            };
          }

          return updated;
        });
      } catch (error) {
        console.error("Failed to load mobile clinic positions", error);
      }
    };

    fetchPositions();
  }, [time]);

  const mapCenter = getMapCenter(positions);
  const bounds = L.latLngBounds(Object.values(positions));

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={mapCenter}
        zoom={16}
        className="z-0 rounded-lg w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {bounds.length > 0 && <FitBounds bounds={bounds} />}

        {positions &&
          Object.entries(positions).map(([key, pos]) => (
            <CircleMarker
              key={key}
              center={pos}
              radius={7}
              pathOptions={{
                color: "#000",
                fillColor: "#ffc107",
                fillOpacity: 1,
              }}
            />
          ))}
      </MapContainer>
    </div>
  );
}

export default Map;
