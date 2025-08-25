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
        const randomLat = latitude + (Math.random() * 0.045) * (Math.random() < 0.5 ? -1 : 1);
        const randomLng = longitude + (Math.random() * 0.045) * (Math.random() < 0.5 ? -1 : 1);
        newPins.push({ lat: randomLat, lng: randomLng, icon: "coin icon" });
      }
      setPins(newPins);
      setIsLoading(false);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ marginTop: "8px" }}>
      <Card title="Coin Collector">
        <p>This is a minimalistic Mini App built with OnchainKit components.</p>
        <ul className="text-[var(--app-foreground-muted)] mb-4 list-disc pl-5 space-y-1 marker:text-[var(--app-foreground-muted)] px-4">
          <li>Connect your wallet first.</li>
          <li>Click &quot;Generate Coins&quot; to create random coin locations.</li>
          <li>You need to be near the coins to collect them.</li>
        </ul>
      </Card>

      <MiniMap pins={pins} />
      <hr style={{ borderColor: "black", marginTop: "8px" }} />
      <Button onClick={generateRandomPins} disabled={isLoading} className="w-full">
        {isLoading ? "Generating..." : "Generate Coins"}
      </Button>
      <hr style={{ borderColor: "black", marginBottom: "8px" }} />
      <TransactionCard pins={pins} />
    </div>
  );
}
