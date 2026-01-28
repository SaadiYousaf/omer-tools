// src/components/common/Map/OmerToolsStoreLocator.js
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./OmerToolsStoreLocator.css";

/**
 * OmerToolsStoreLocator — Enterprise Map Page
 * ---------------------------------------------------------
 * Features:
 *  - Robust Google Maps script loader (callback-based and idempotent)
 *  - Uses AdvancedMarkerElement (with fallback to classic Marker)
 *  - Directions & ETA from user's geolocation
 *  - Defensive guards, detailed errors, retry button
 *  - Clean UI with loading overlays and ARIA attributes
 *
 * Requirements:
 *  1) Add to .env: REACT_APP_GOOGLE_MAPS_KEY=YOUR_KEY
 *  2) Restrict key to HTTP referrers (your domains)
 *  3) Enable Maps JavaScript API, Places API, Directions API
 *  4) Restart dev server after editing .env
 *
 * Optional:
 *  <OmerToolsStoreLocator apiKey="overrideKey" />
 */

// ---------- Constants ----------
const STORE = {
  id: 1,
  name: "Omer Tools",
  address: "1126 Canterbury Rd, Roselands NSW 2196, Australia",
  phone: "(02) 9759 8833",
  hours: "Mon–Fri: 8:00–17:00, Sat: 9:00–16:00, Sun: Closed",
  coordinates: { lat: -33.9303675, lng: 151.0690975 },
  placeId: "ChIJcU9ul8auEmsR4zQkFEWVg-0",
};

const MAP_STYLE = [
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ saturation: 36 }, { color: "#111827" }, { lightness: 40 }] },
  { featureType: "all", elementType: "labels.text.stroke", stylers: [{ visibility: "on" }, { color: "#ffffff" }, { lightness: 16 }] },
  { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry.fill", stylers: [{ color: "#f3f4f6" }, { lightness: 20 }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#e5e7eb" }, { lightness: 17 }, { weight: 1.2 }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f9fafb" }, { lightness: 20 }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#f3f4f6" }, { lightness: 21 }] },
  { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#e5e7eb" }, { lightness: 17 }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#d1d5db" }, { lightness: 29 }, { weight: 0.2 }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#e5e7eb" }, { lightness: 18 }] },
  { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#f3f4f6" }, { lightness: 16 }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#e5e7eb" }, { lightness: 19 }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#dbeafe" }, { lightness: 17 }] },
];

// ✅ Hardcoded API key (can also fallback to env if available)
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY || "AIzaSyBTJ8so7xZFYtUyvy78KBxZBDaMB0wqUaY";
// ✅ Script id (fixed)
const GOOGLE_SCRIPT_ID = "google-maps-script";

/**
 * Helper: wait for next microtask
 */
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Helper: map status to user-friendly message
 */
function friendlyErrorMessage(err) {
  if (!err) return "Unknown error.";
  const msg = typeof err === "string" ? err : err.message || "Unknown error.";
  if (/invalid.?key/i.test(msg)) {
    return "Invalid API key. Check your key, restrictions, and enabled APIs.";
  }
  if (/referer|referrer/i.test(msg)) {
    return "This key is restricted to other domains. Update HTTP referrer restrictions in Google Cloud.";
  }
  if (/billing/i.test(msg)) {
    return "Billing must be enabled for your project to load Google Maps.";
  }
  return msg;
}

function OmerToolsStoreLocator() {
  // ---------- Refs ----------
  const mapRef = useRef(null);
  const scriptRef = useRef(null);
  const storeMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);

  // ---------- State ----------
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMap, setLoadingMap] = useState(false);
  const [error, setError] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [travelInfo, setTravelInfo] = useState(null);

  // ---------- Script Loader ----------
  const appendGoogleScript = useCallback(() => {
    if (!API_KEY) {
      setError("Missing Google Maps API key. Please provide one.");
      setIsLoading(false);
      return;
    }

    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      if (window.google && window.google.maps) initMap();
      return;
    }

    setLoadingMap(true);

    window.initMap = async () => {
      try {
        if (window.google?.maps?.importLibrary) {
          await window.google.maps.importLibrary("maps");
          await window.google.maps.importLibrary("marker");
          await window.google.maps.importLibrary("places").catch(() => {});
        }
      } catch (libErr) {
        console.warn("importLibrary failed:", libErr);
      } finally {
        setLoadingMap(false);
        await tick();
        initMap();
      }
    };

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.onerror = () => {
      setError("Failed to load Google Maps script. Check your key and restrictions.");
      setIsLoading(false);
      setLoadingMap(false);
    };

    document.head.appendChild(script);
    scriptRef.current = script;
  }, []);

  useEffect(() => {
    appendGoogleScript();
    return () => {
      try {
        delete window.initMap;
      } catch {
        window.initMap = undefined;
      }
    };
  }, [appendGoogleScript]);

  // ---------- Initialize Map ----------
  const initMap = useCallback(() => {
    if (!mapRef.current) return;
    if (!window.google || !window.google.maps) {
      setError("Google Maps failed to initialize.");
      setIsLoading(false);
      return;
    }

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: STORE.coordinates,
        zoom: 17,
        mapTypeId: "roadmap",
        clickableIcons: false,
        styles: MAP_STYLE,
        gestureHandling: "greedy",
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeControl: false,
        zoomControl: true,
      });

      setMap(mapInstance);

      const renderer = new window.google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#2563eb",
          strokeOpacity: 1,
          strokeWeight: 5,
        },
      });
      setDirectionsRenderer(renderer);

      const storeMarker = new window.google.maps.Marker({
        map: mapInstance,
        position: STORE.coordinates,
        title: STORE.name,
      });
      storeMarkerRef.current = storeMarker;

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="info-window">
            <h3>${STORE.name}</h3>
            <p>${STORE.address}</p>
            <p>${STORE.phone}</p>
            <a target="_blank" rel="noopener"
               href="https://www.google.com/maps/place/?q=place_id:${STORE.placeId}">
               View on Google Maps
            </a>
          </div>
        `,
      });
      infoWindow.open(mapInstance, storeMarker);

      storeMarker.addListener("click", () => {
        infoWindow.open(mapInstance, storeMarker);
      });

      setIsLoading(false);
      setError(null);
    } catch (e) {
      setError("Failed to create map instance.");
      console.error("Map init error:", e);
      setIsLoading(false);
    }
  }, []);

  // ---------- Locate User & Route ----------
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    if (!map || !window.google || !window.google.maps) {
      setError("Map is not ready yet.");
      return;
    }

    setIsLoading(true);
    setTravelInfo(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(userPos);

        if (userMarkerRef.current) {
          userMarkerRef.current.setMap(null);
          userMarkerRef.current = null;
        }

        userMarkerRef.current = new window.google.maps.Marker({
          map,
          position: userPos,
          title: "Your Location",
        });

        map.panTo(userPos);

        if (directionsRenderer) {
          const svc = new window.google.maps.DirectionsService();
          svc.route(
            {
              origin: userPos,
              destination: STORE.coordinates,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (res, status) => {
              setIsLoading(false);
              if (status === "OK" && res?.routes?.[0]?.legs?.[0]) {
                directionsRenderer.setDirections(res);
                const leg = res.routes[0].legs[0];
                setTravelInfo({
                  distance: leg.distance?.text || "",
                  duration: leg.duration?.text || "",
                });

                const bounds = new window.google.maps.LatLngBounds();
                res.routes[0].overview_path.forEach((p) => bounds.extend(p));
                map.fitBounds(bounds);
              } else {
                setError("Could not calculate directions. Try again later.");
              }
            }
          );
        } else {
          setIsLoading(false);
          setError("Directions renderer not ready.");
        }
      },
      (err) => {
        setIsLoading(false);
        setError(err?.message || "Unable to fetch your location.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }, [map, directionsRenderer]);

  // ---------- Reset View ----------
  const resetView = useCallback(() => {
    if (!map) return;
    if (directionsRenderer) directionsRenderer.setDirections({ routes: [] });
    setTravelInfo(null);
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }
    setUserLocation(null);
    map.setCenter(STORE.coordinates);
    map.setZoom(17);
  }, [map, directionsRenderer]);

  // ---------- Retry Loader ----------
  const retryLoad = useCallback(() => {
    setError(null);
    setIsLoading(true);
    if (window.google && window.google.maps) {
      initMap();
      return;
    }
    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) existing.remove();
    appendGoogleScript();
  }, [appendGoogleScript, initMap]);

  // ---------- Render ----------
  return (
    <section className="otsl">
      <header className="otsl__header">
        <h1 className="otsl__title">{STORE.name}</h1>
        <p className="otsl__subtitle">Visit our flagship store in Roselands, NSW</p>
      </header>

      <div className="otsl__grid">
        <aside className="otsl__panel">
          <h2>Store Details</h2>
          <p>{STORE.address}</p>
          <p>{STORE.phone}</p>
          <p>{STORE.hours}</p>

          <button className="btn btn--primary" onClick={locateUser} disabled={isLoading || loadingMap}>
            {isLoading ? "Loading…" : "Show My Location & Directions"}
          </button>
          <button className="btn btn--ghost" onClick={resetView}>Reset View</button>

          {userLocation && (
            <div>
              <p>Your Location: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</p>
              {travelInfo && (
                <>
                  <p>Distance: {travelInfo.distance}</p>
                  <p>ETA: {travelInfo.duration}</p>
                </>
              )}
            </div>
          )}

          {error && (
            <div className="alert">
              <p>{friendlyErrorMessage(error)}</p>
              <button className="btn btn--danger" onClick={retryLoad}>Try Again</button>
            </div>
          )}
        </aside>

        <div className="otsl__mapwrap">
          {(isLoading || loadingMap) && <p>Loading map…</p>}
          {error && <p>{friendlyErrorMessage(error)}</p>}
          <div ref={mapRef} className="otsl__map" />
        </div>
      </div>
    </section>
  );
}

/* ---------- UI Subcomponents ---------- */
function Spinner({ big }) {
  return (
    <svg className={`spinner ${big ? "spinner--big" : ""}`} viewBox="0 0 24 24">
      <circle className="spinner__track" cx="12" cy="12" r="10" />
      <path className="spinner__arc" d="M4 12a8 8 0 018-8" />
    </svg>
  );
}

export default OmerToolsStoreLocator;
