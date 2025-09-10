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
import { supabase } from "../../services";

// fit map bounds helper
const FitBounds = ({ bounds, padding = [32, 32], maxZoom = 15 }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding, maxZoom });
    }
  }, [map, bounds, padding, maxZoom]);
  return null;
};

const AdminRoutes = () => {
  const [places, setPlaces] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeHistory, setRouteHistory] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [currentRoute, setCurrentRoute] = useState(null);

  const [routeCoords, setRouteCoords] = useState([]); // polyline coordinates

  const [loading, setLoading] = useState(false);

  // fetch places + routes
  useEffect(() => {
    const loadData = async () => {
      const { data: placesData, error: placesError } = await supabase
        .from("places")
        .select("*")
        .order("name");

      if (placesError) {
        console.error("Error fetching places:", placesError);
      } else {
        setPlaces(placesData);
      }

      const { data: routesData, error: routesError } = await supabase
        .from("routes")
        .select("*, from:from_id(name), to:to_id(name)")
        .order("created_at", { ascending: false });

      if (routesError) {
        console.error("Error fetching routes:", routesError);
      } else {
        setRouteHistory(routesData);
        const total = routesData.reduce(
          (sum, r) => sum + parseFloat(r.distance_km),
          0
        );
        setTotalDistance(total);
      }
    };

    loadData();
  }, []);

  // fetch route from OSRM
  const calculateRoute = async () => {
    if (!origin || !destination) return;
    setLoading(true);

    const from = places.find((p) => p.id === origin);
    const to = places.find((p) => p.id === destination);
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

    setLoading(false);
  };

  // save route to supabase
  const saveRoute = async () => {
    if (!currentRoute) return;
    const { from, to, distance, duration } = currentRoute;

    const distanceKm = parseFloat(distance.replace(/[^\d.]/g, "")) || 0;
    const durationMin = parseFloat(duration.replace(/[^\d.]/g, "")) || 0;

    const { data, error } = await supabase
      .from("routes")
      .insert([
        {
          from_id: from,
          to_id: to,
          distance_km: distanceKm,
          duration_min: durationMin,
        },
      ])
      .select("*, from:from_id(name), to:to_id(name)");

    if (error) {
      console.error("Error saving route:", error);
      return;
    }

    // update state
    const newRoute = data[0];
    setRouteHistory([newRoute, ...routeHistory]);
    setTotalDistance(totalDistance + parseFloat(distanceKm));

    // clear current selections
    setOrigin("");
    setDestination("");
    setCurrentRoute(null);
    setRouteCoords([]);
  };

  const selectedPoints = [];
  const fromSel = origin ? places.find((p) => p.id === origin) : null;
  if (fromSel) selectedPoints.push([fromSel.lat, fromSel.lng]);

  const toSel = destination ? places.find((p) => p.id === destination) : null;
  if (toSel) selectedPoints.push([toSel.lat, toSel.lng]);

  // decide which points to use for bounds
  const boundsPoints =
    routeCoords.length > 0
      ? routeCoords.map((p) => [p.lat, p.lng]) // 1) use the route polyline
      : selectedPoints.length > 0
      ? selectedPoints // 2) or the selected places
      : places.map((p) => [p.lat, p.lng]); // 3) or all places (initial)

  // make bounds (or null if no data yet)
  const bounds =
    boundsPoints && boundsPoints.length > 0
      ? L.latLngBounds(boundsPoints)
      : null;

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
                    {places.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
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
                    {places.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={calculateRoute}
                  disabled={!origin || !destination}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full"
                >
                  <Route className="h-4 w-4 mr-2" />
                  {loading ? "Calculating" : "Calculate"} Route
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
                  {currentRoute.from.name} → {currentRoute.to.name} •{" "}
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
            {totalDistance > 0 && (
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
            )}
          </div>

          {/* Map and History Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-lg border bg-white shadow-sm h-[400px]">
              <MapContainer
                center={{ lat: -26.2041, lng: 28.0473 }} // fallback (Johannesburg)
                zoom={14}
                className="w-full h-full rounded-lg"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {places.map((p) => (
                  <Marker key={p.id} position={{ lat: p.lat, lng: p.lng }} />
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
                    {routeHistory.map((r) => (
                      <div key={r.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {r.from.name} → {r.to.name}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>{r.distance_km}</span>
                              <span>{r.duration_min}</span>
                              <span>
                                {new Date(r.created_at).toLocaleDateString()}
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
