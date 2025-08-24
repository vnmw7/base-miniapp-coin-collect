"use client";

import { Card } from "./Card";
import { MiniMap } from "./MiniMap";
import { TransactionCard } from "./TransactionCard";

type HomeProps = {
  setActiveTab: (tab: string) => void;
};

export function Home({  }: HomeProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="My First Mini App">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          This is a minimalistic Mini App built with OnchainKit components.
        </p>
      </Card>

      <MiniMap />

      <TransactionCard />
    </div>
  );
}
