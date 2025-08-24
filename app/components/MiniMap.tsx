"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

export function MiniMap({ pins = [] }: { pins?: [number, number][] }) {
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
        <Marker key={index} position={pin}></Marker>
      ))}
    </MapContainer>
  );
}
