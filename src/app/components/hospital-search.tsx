import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { ArrowLeft, MapPin, ExternalLink, Search, Loader2 } from "lucide-react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

interface HospitalPlace {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  placeId?: string;
}

const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 };
const MAP_CONTAINER_STYLE = { width: "100%", height: "280px" };

export function HospitalSearch() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<HospitalPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    id: "google-map-script",
  });

  const fetchNearbyHospitals = useCallback(
    (location: { lat: number; lng: number }) => {
      if (!window.google?.maps?.places) return;

      setLoading(true);
      setError(null);

      const attributionDiv = document.createElement("div");
      attributionDiv.style.display = "none";
      document.body.appendChild(attributionDiv);
      const placesService = new google.maps.places.PlacesService(attributionDiv);

      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: 10000,
        type: "hospital",
      };

      placesService.nearbySearch(request, (results, status) => {
        document.body.removeChild(attributionDiv);
        setLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const places: HospitalPlace[] = results.slice(0, 15).map((p) => ({
            id: p.place_id || String(Math.random()),
            name: p.name || "Unknown",
            address: p.vicinity,
            lat: p.geometry?.location?.lat() ?? 0,
            lng: p.geometry?.location?.lng() ?? 0,
            placeId: p.place_id,
          }));
          setHospitals(places);
        } else {
          document.body.removeChild(attributionDiv);
          setError("Could not find nearby hospitals. Try enabling location.");
        }
      });
    },
    []
  );

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(loc);
        fetchNearbyHospitals(loc);
      },
      () => {
        setLoading(false);
        setError("Location access denied. Using default area.");
        fetchNearbyHospitals(DEFAULT_CENTER);
      }
    );
  };

  useEffect(() => {
    if (isLoaded && GOOGLE_MAPS_API_KEY) {
      getCurrentLocation();
    }
  }, [isLoaded, GOOGLE_MAPS_API_KEY]);

  const onMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const filteredHospitals = searchQuery
    ? hospitals.filter((h) =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : hospitals;

  const noApiKey = !GOOGLE_MAPS_API_KEY;
  const showMap = isLoaded && !loadError && !noApiKey;

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAF9] overflow-hidden">
      <header className="sticky top-0 z-20 glass-panel border-b border-black/5">
        <div className="flex items-center justify-between px-4 py-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-black/5"
          >
            <ArrowLeft className="w-5 h-5 text-stone-700" />
          </motion.button>
          <h2 className="text-sm font-semibold text-stone-800 uppercase tracking-wider">
            Nearby hospitals
          </h2>
          <div className="w-9" />
        </div>
      </header>

      <div className="overflow-y-auto px-4 py-6 pb-24">
        {noApiKey ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-sm text-amber-800 font-medium mb-2">
              Google Maps API key required
            </p>
            <p className="text-xs text-amber-700 mb-4">
              Create a <code className="bg-amber-100 px-1 rounded">.env</code> file with
              <code className="block mt-1 bg-amber-100 px-2 py-1 rounded text-left">
                VITE_GOOGLE_MAPS_API_KEY=your_key
              </code>
            </p>
            <p className="text-xs text-stone-600">
              Enable <strong>Maps JavaScript API</strong> and{" "}
              <strong>Places API</strong> at{" "}
              <a
                href="https://console.cloud.google.com/google/maps-apis/"
                target="_blank"
                rel="noreferrer"
                className="text-[#0D9488] underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="search"
                  placeholder="Search hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={getCurrentLocation}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0B8075] disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                Refresh
              </motion.button>
            </div>

            {error && (
              <p className="text-sm text-amber-700 mb-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
                {error}
              </p>
            )}

            {showMap && (
              <div className="rounded-xl overflow-hidden border border-stone-200 mb-6">
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
                  center={center}
                  zoom={13}
                  onLoad={onMapLoad}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                  }}
                />
              </div>
            )}

            <div className="space-y-3">
              {loading && hospitals.length === 0 ? (
                <div className="flex items-center justify-center py-12 gap-2 text-stone-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Finding nearby hospitals...</span>
                </div>
              ) : filteredHospitals.length === 0 ? (
                <p className="text-center py-12 text-stone-500 text-sm">
                  No hospitals found. Try a different search or refresh location.
                </p>
              ) : (
                filteredHospitals.map((h) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bento-card p-4 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900">{h.name}</p>
                        {h.address && (
                          <p className="text-sm text-stone-500 mt-0.5">{h.address}</p>
                        )}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-[#0D9488] hover:underline"
                        >
                          <MapPin className="w-4 h-4" />
                          Get directions
                        </a>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg hover:bg-stone-100"
                        aria-label="View on Maps"
                      >
                        <ExternalLink className="w-4 h-4 text-stone-500" />
                      </a>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
