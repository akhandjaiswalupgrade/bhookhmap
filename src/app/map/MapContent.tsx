"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Star, Clock, MapPin } from "lucide-react";
import type { Place } from "@/types";

// Leaflet icon fix — safe because this file is only loaded client-side via dynamic import
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const LUCKNOW_CENTER: [number, number] = [26.8598, 80.9319];
const DEFAULT_ZOOM = 13;

const TYPE_EMOJI: Record<string, string> = {
  shop: "🏪",
  cart: "🛒",
  dhaba: "🍽️",
  stall: "🥘",
  restaurant: "🏨",
};

function createMarkerIcon(place: Place) {
  const isOpen = place.isOpenNow ?? false;
  const emoji = TYPE_EMOJI[place.type] || "📍";
  const bgColor = isOpen ? "#E8732A" : "#9CA3AF";
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative; width: 44px; height: 44px;">
        <!-- Pulse for open -->
        ${isOpen ? '<div style="position:absolute;inset:0;border-radius:50%;background:#E8732A;opacity:0.3;animation:marker-pulse 2s infinite;"></div>' : ''}
        <!-- Marker body -->
        <div style="position:absolute;inset:0;background:${bgColor};border:3px solid white;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;font-size:18px;">
          ${emoji}
        </div>
        <!-- Tail -->
        <div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%) rotate(45deg);width:12px;height:12px;background:${bgColor};border-right:3px solid white;border-bottom:3px solid white;"></div>
      </div>
      <style>
        @keyframes marker-pulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      </style>
    `,
    iconSize: [44, 50],
    iconAnchor: [22, 50],
    popupAnchor: [0, -50],
  });
}

function MapMarkers({
  places,
  selectedArea,
  selectedType,
}: {
  places: Place[];
  selectedArea: string | null;
  selectedType: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(LUCKNOW_CENTER, DEFAULT_ZOOM);
  }, [map]);

  const filtered = places.filter(
    (p) =>
      (!selectedArea || p.area === selectedArea) &&
      (!selectedType || p.type === selectedType)
  );

  return (
    <>
      {filtered.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={createMarkerIcon(place)}
        >
          <Popup closeButton={false} maxWidth={280} className="custom-popup">
            <div style={{ padding: "4px 2px", minWidth: 240 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      margin: 0,
                      color: "#1A1A1A",
                      lineHeight: 1.2,
                    }}
                  >
                    {place.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#6B6B6B",
                      marginTop: 2,
                    }}
                  >
                    <MapPin style={{ width: 11, height: 11 }} />
                    <span>{place.area}</span>
                    <span>·</span>
                    <span style={{ textTransform: "capitalize" }}>{place.type}</span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    background: "#FFFBF5",
                    padding: "3px 8px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#F59E0B",
                    flexShrink: 0,
                  }}
                >
                  <Star style={{ width: 11, height: 11, fill: "#F59E0B" }} />
                  {place.rating.toFixed(1)}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    padding: "2px 8px",
                    borderRadius: 999,
                    fontWeight: 600,
                    background: place.isOpenNow ? "#E8F5E9" : "#F5F0EB",
                    color: place.isOpenNow ? "#2E7D32" : "#6B6B6B",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: place.isOpenNow ? "#4CAF50" : "#9CA3AF",
                    }}
                  />
                  {place.isOpenNow ? "अभी खुला" : "बंद है"}
                </span>
                {place.reviewCount !== undefined && (
                  <span style={{ color: "#6B6B6B" }}>
                    {place.reviewCount} reviews
                  </span>
                )}
              </div>

              <a
                href={`/place/${place.id}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "8px 12px",
                  background: "#E8732A",
                  color: "white",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                विस्तार से देखें →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

interface MapContentProps {
  places: Place[];
  selectedArea: string | null;
  selectedType: string | null;
}

export default function MapContent({
  places,
  selectedArea,
  selectedType,
}: MapContentProps) {
  return (
    <MapContainer
      center={LUCKNOW_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapMarkers
        places={places}
        selectedArea={selectedArea}
        selectedType={selectedType}
      />
    </MapContainer>
  );
}
