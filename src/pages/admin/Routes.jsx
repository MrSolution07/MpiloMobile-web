import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Navigation, History, Route, ArrowRight, Clock, Car } from 'lucide-react';

const Index = () => {
  const [currentLocation, setCurrentLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [routeHistory, setRouteHistory] = useState(() => {
    const saved = localStorage.getItem('clinicRouteHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [totalDistance, setTotalDistance] = useState(() => {
    const saved = localStorage.getItem('totalDistance');
    return saved ? parseFloat(saved) : 0;
  });
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mapRef = useRef(null);
  const map = useRef(null);
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);
  const autocompleteService = useRef(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;

      map.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: -26.2041, lng: 28.0473 }, // Johannesburg default
        zoom: 13,
        styles: [
          {
            featureType: 'poi.medical',
            stylers: [{ visibility: 'on' }, { color: '#3b82f6' }]
          }
        ]
      });

      directionsService.current = new window.google.maps.DirectionsService();
      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#3b82f6',
          strokeWeight: 4
        }
      });
      directionsRenderer.current.setMap(map.current);

      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=API_KEY&libraries=places`;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              if (status === 'OK' && results && results[0]) {
                setCurrentLocation(results[0].formatted_address);
                if (map.current) {
                  map.current.setCenter({ lat: latitude, lng: longitude });
                }
              }
              setIsLoadingLocation(false);
            }
          );
        },
        () => {
          setIsLoadingLocation(false);
          // Fallback to IP-based location or default
          setCurrentLocation('Current Location (Enable GPS for accuracy)');
        }
      );
    }
  }, []);

  // Search for destination suggestions
  const searchDestinations = useCallback((query) => {
    if (!autocompleteService.current || query.length < 3) {
      setDestinationSuggestions([]);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      {
        input: query,
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'za' } // Restrict to South Africa
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setDestinationSuggestions(
            predictions.slice(0, 5).map(p => p.description)
          );
        } else {
          setDestinationSuggestions([]);
        }
      }
    );
  }, []);

  // Calculate route
  const calculateRoute = useCallback(() => {
    if (!directionsService.current || !currentLocation || !destination) return;

    const request = {
      origin: currentLocation,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true
    };

    directionsService.current.route(request, (result, status) => {
      if (status === 'OK' && result) {
        const routes = result.routes.map((route, index) => ({
          distance: route.legs[0].distance ? route.legs[0].distance.text : '',
          duration: route.legs[0].duration ? route.legs[0].duration.text : '',
          type: index === 0 ? 'fastest' : 'shortest'
        }));

        setRouteOptions(routes);
        setSelectedRoute(routes[0]);
        
        if (directionsRenderer.current) {
          directionsRenderer.current.setDirections(result);
        }
      }
    });
  }, [currentLocation, destination]);

  // Save route to history
  const saveRoute = useCallback(() => {
    if (!selectedRoute || !currentLocation || !destination) return;

    const newRoute = {
      id: Date.now().toString(),
      from: currentLocation,
      to: destination,
      distance: selectedRoute.distance,
      duration: selectedRoute.duration,
      timestamp: new Date()
    };

    const updatedHistory = [newRoute, ...routeHistory];
    setRouteHistory(updatedHistory);
    localStorage.setItem('clinicRouteHistory', JSON.stringify(updatedHistory));

    // Update total distance
    const distanceValue = parseFloat(selectedRoute.distance.replace(/[^\d.]/g, ''));
    const newTotal = totalDistance + distanceValue;
    setTotalDistance(newTotal);
    localStorage.setItem('totalDistance', newTotal.toString());

    // Clear current route
    setDestination('');
    setRouteOptions([]);
    setSelectedRoute(null);
  }, [selectedRoute, currentLocation, destination, routeHistory, totalDistance]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-3 py-1">
          <h1 className="text-base font-semibold text-gray-900 text-left">Mobile Clinic Routes</h1>
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
                  <label className="text-sm font-medium text-gray-700">From (Current Location)</label>
                  <div className="flex gap-2">
                    <input
                      value={currentLocation}
                      onChange={(e) => setCurrentLocation(e.target.value)}
                      placeholder="Enter starting point"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1"
                    />
                    <button
                      onClick={getCurrentLocation}
                      disabled={isLoadingLocation}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900 h-9 px-3"
                    >
                      <MapPin className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-gray-700">To (Destination)</label>
                  <input
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      searchDestinations(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Enter destination"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  
                  {showSuggestions && destinationSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                      {destinationSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setDestination(suggestion);
                            setShowSuggestions(false);
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={calculateRoute}
                  disabled={!currentLocation || !destination}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full"
                >
                  <Route className="h-4 w-4 mr-2" />
                  Calculate Route
                </button>
              </div>
            </div>

            {/* Recommended Routes */}
            {routeOptions.length > 0 && (
              <div className="rounded-lg border-2 border-blue-500 bg-blue-50 text-gray-900 shadow-md animate-fade-in">
                <div className="flex flex-col space-y-1.5 p-4">
                  <h3 className="text-lg font-bold leading-none tracking-tight flex items-center gap-2 text-blue-700">
                    <ArrowRight className="h-5 w-5 text-blue-600 animate-bounce" />
                    Recommended Routes
                  </h3>
                </div>
                <div className="p-4 pt-0 space-y-3">
                  {routeOptions.map((route, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg cursor-pointer transition-all flex items-center justify-between gap-2 shadow-sm ${
                        selectedRoute === route
                          ? 'border-blue-600 bg-white scale-105 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-400 hover:bg-blue-100'
                      }`}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold mr-2 ${
                          route.type === 'fastest'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}>
                          {route.type === 'fastest' ? 'Fastest' : 'Alternative'}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {route.distance} • {route.duration}
                        </span>
                      </div>
                      {selectedRoute === route && (
                        <span className="text-xs text-blue-600 font-semibold animate-pulse">Selected</span>
                      )}
                    </div>
                  ))}
                  {selectedRoute && (
                    <button
                      onClick={saveRoute}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2 w-full mt-4 shadow-md animate-fade-in"
                    >
                      Save Route & Start Navigation
                    </button>
                  )}
                </div>
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
                  <div className="text-3xl font-bold text-purple-600">{totalDistance.toFixed(1)} km</div>
                  <p className="text-sm text-gray-600">Total Distance Travelled</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map and History Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-lg border bg-white text-gray-900 shadow-sm">
              <div className="p-0">
                <div ref={mapRef} className="w-full h-[400px] rounded-lg" />
              </div>
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
                  <p className="text-gray-500 text-center py-8">No routes recorded yet</p>
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
                              <span>{new Date(route.timestamp).toLocaleDateString()}</span>
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

export default Index;
