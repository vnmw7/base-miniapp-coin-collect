"use client";

import { Card } from "./Card";
import dynamic from 'next/dynamic';
import { useState } from "react";
import { Button } from "./Button";

const MiniMap = dynamic(() => import('./MiniMap').then(mod => mod.MiniMap), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
import { TransactionCard } from "./TransactionCard";

type HomeProps = {
  setActiveTab: (tab: string) => void;
};

export function Home({  }: HomeProps) {
const [pins, setPins] = useState<{ lat: number; lng: number; icon: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRandomPins = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const newPins: { lat: number; lng: number; icon: string }[] = [];
      for (let i = 0; i < 5; i++) {
        //- 1km is approx 0.009 degrees of latitude
        //- 5km is approx 0.045 degrees of latitude
        const randomLat = latitude + (Math.random() * 0.018 + 0.009) * (Math.random() < 0.5 ? -1 : 1);
        const randomLng = longitude + (Math.random() * 0.018 + 0.009) * (Math.random() < 0.5 ? -1 : 1);
        newPins.push({ lat: randomLat, lng: randomLng, icon: "coin icon" });
      }
      setPins(newPins);
      setIsLoading(false);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Coin Collector">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          This is a minimalistic Mini App built with OnchainKit components.
        </p>
      </Card>

      <MiniMap pins={pins} />
      <Button onClick={generateRandomPins} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Coins"}
      </Button>
      <TransactionCard />
    </div>
  );
}
