import "leaflet/dist/leaflet.css";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MapPin,
  Navigation,
  History,
  Route,
  ArrowRight,
  Clock,
  Car,
} from "lucide-react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// predetermined places with coordinates
const PLACES = [
  { name: "Clinic 1", coords: { lat: -25.748, lng: 28.229 } },
  { name: "Clinic 2", coords: { lat: -25.746, lng: 28.221 } },
  { name: "Clinic 3", coords: { lat: -25.745, lng: 28.228 } },
];

// fit map bounds helper
const FitBounds = ({ bounds }) => {
  const map = useMap();
  if (bounds && bounds.length > 0) map.fitBounds(bounds);
  return null;
};

const AdminRoutes = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeHistory, setRouteHistory] = useState(() => {
    const saved = localStorage.getItem("clinicRouteHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [totalDistance, setTotalDistance] = useState(() => {
    const saved = localStorage.getItem("totalDistance");
    return saved ? parseFloat(saved) : 0;
  });
  const [currentRoute, setCurrentRoute] = useState(null);

  const [routeCoords, setRouteCoords] = useState([]); // Polyline coordinates

  // fetch route from OSRM
  const calculateRoute = async () => {
    if (!origin || !destination) return;
    const from = PLACES.find((p) => p.name === origin)?.coords;
    const to = PLACES.find((p) => p.name === destination)?.coords;
    if (!from || !to) return;

    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const coords = route.geometry.coordinates.map(([lng, lat]) => ({
        lat,
        lng,
      }));

      setRouteCoords(coords);
      const distanceKm = (route.distance / 1000).toFixed(1);
      const durationMin = Math.ceil(route.duration / 60);

      setCurrentRoute({
        from: origin,
        to: destination,
        distance: `${distanceKm} km`,
        duration: `${durationMin} min`,
      });
    }
  };

  // save route to history
  const saveRoute = () => {
    if (!currentRoute) return;
    const newHistory = [
      { id: Date.now(), ...currentRoute, timestamp: new Date() },
      ...routeHistory,
    ];
    setRouteHistory(newHistory);
    localStorage.setItem("clinicRouteHistory", JSON.stringify(newHistory));

    // update total distance
    const distanceValue = parseFloat(
      currentRoute.distance.replace(/[^\d.]/g, "")
    );
    const newTotal = totalDistance + distanceValue;
    setTotalDistance(newTotal);
    localStorage.setItem("totalDistance", newTotal.toString());

    // clear current selections
    setOrigin("");
    setDestination("");
    setCurrentRoute(null);
    setRouteCoords([]);
  };

  const bounds = routeCoords.length > 0 ? L.latLngBounds(routeCoords) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-3 py-1">
          <h1 className="text-base font-semibold text-gray-900 text-left">
            Mobile Clinic Routes
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Route Planning Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Location Inputs */}
            <div className="rounded-lg border bg-white text-gray-900 shadow-sm">
              <div className="flex flex-col space-y-1.5 p-4">
                <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  Route Planning
                </h3>
              </div>
              <div className="p-4 pt-0 space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    From (Origin)
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="">Select origin</option>
                    {PLACES.map((place) => (
                      <option key={place.name} value={place.name}>
                        {place.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    To (Destination)
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="">Select destination</option>
                    {PLACES.map((place) => (
                      <option key={place.name} value={place.name}>
                        {place.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={calculateRoute}
                  // disabled={!currentLocation || !destination}
                  disabled={!origin || !destination}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full"
                >
                  <Route className="h-4 w-4 mr-2" />
                  Calculate Route
                </button>
              </div>
            </div>

            {/* Current Route */}
            {currentRoute && (
              <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-4 space-y-2">
                <h4 className="text-blue-700 font-bold flex items-center gap-2">
                  <ArrowRight className="animate-bounce" /> Recommended Route
                </h4>
                <div>
                  {currentRoute.from} → {currentRoute.to} •{" "}
                  {currentRoute.distance} • {currentRoute.duration}
                </div>
                <button
                  onClick={saveRoute}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Save Route & Start Navigation
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="rounded-lg border bg-white text-gray-900 shadow-sm">
              <div className="flex flex-col space-y-1.5 p-4">
                <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                  <Car className="h-5 w-5 text-purple-600" />
                  Travel Statistics
                </h3>
              </div>
              <div className="p-4 pt-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {totalDistance.toFixed(1)} km
                  </div>
                  <p className="text-sm text-gray-600">
                    Total Distance Travelled
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map and History Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-lg border bg-white shadow-sm h-[400px]">
              <MapContainer
                center={{ lat: -25.747, lng: 28.225 }}
                zoom={14}
                className="w-full h-full rounded-lg"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {PLACES.map((p) => (
                  <Marker key={p.name} position={p.coords} />
                ))}
                {routeCoords.length > 0 && (
                  <Polyline positions={routeCoords} color="blue" />
                )}
                {bounds && <FitBounds bounds={bounds} />}
              </MapContainer>
            </div>

            {/* Route History */}
            <div className="rounded-lg border bg-white text-gray-900 shadow-sm">
              <div className="flex flex-col space-y-1.5 p-4">
                <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                  <History className="h-5 w-5 text-orange-600" />
                  Route History
                </h3>
              </div>
              <div className="p-4 pt-0">
                {routeHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No routes recorded yet
                  </p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {routeHistory.map((route) => (
                      <div key={route.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {route.from} → {route.to}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>{route.distance}</span>
                              <span>{route.duration}</span>
                              <span>
                                {new Date(route.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoutes;
