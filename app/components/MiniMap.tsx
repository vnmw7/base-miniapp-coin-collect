"use client";

import { MapContainer, TileLayer, Marker, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";

// Fix for default icon issue with webpack
// Extend the prototype type to include optional _getIconUrl so we avoid using `any`.
interface IconDefaultPrototype {
  _getIconUrl?: unknown;
}

const iconDefaultProto = L.Icon.Default.prototype as IconDefaultPrototype;
delete iconDefaultProto._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const coinIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSIjRkZENTAwIiBzdHJva2U9IiNEQUE1MjAiIHN0cm9rZS13aWR0aD0iNSIvPgogIDx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1zaXplPSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0RBQTUyMCI+JDwvdGV4dD4KPC9zdmc+",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

type Pin = {
  lat: number;
  lng: number;
  icon: string;
};

function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPosition: [number, number] = [latitude, longitude];
        setPosition(newPosition);
        map.flyTo(newPosition, 13);
      },
      () => {
        // Handle error or permission denied
      },
      {
        enableHighAccuracy: true,
        timeout: 500,
        maximumAge: 0,
      }
    );

    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const newPosition: [number, number] = [latitude, longitude];
        setPosition(newPosition);
      });
    }, 3000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);
    };
  }, [map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export function MiniMap({ pins = [] }: { pins?: Pin[] }) {
  const position: [number, number] = [0, 0]; // Default position

  return (
    <MapContainer
      center={position}
      zoom={5}
      minZoom={5}
      maxZoom={19}
      scrollWheelZoom={false}
      style={{ height: "250px", width: "100%", marginTop: '20px', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
      {pins.map((pin, index) => (
        <>
          <Marker
            key={index}
            position={[pin.lat, pin.lng]}
            icon={coinIcon}
          ></Marker>
          <Circle
            key={`${index}-radius`}
            center={[pin.lat, pin.lng]}
            radius={1000} // 2km in meters
            pathOptions={{ color: "white", fillColor: "white", fillOpacity: 0.5 }}
          />
        </>
      ))}
    </MapContainer>
  );
}
