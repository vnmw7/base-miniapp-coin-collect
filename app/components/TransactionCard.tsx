"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionError,
  TransactionResponse,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionStatus,
} from "@coinbase/onchainkit/transaction";
import { useNotification } from "@coinbase/onchainkit/minikit";
import { Card } from "./Card";

type Pin = { lat: number; lng: number; icon: string };

export function TransactionCard({ pins = [] }: { pins?: Pin[] }) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const { address } = useAccount();

  // Example transaction call - sending 0 ETH to self
  const calls = useMemo(() => address
    ? [
        {
          to: address,
          data: "0x" as `0x${string}`,
          value: BigInt(0),
        },
      ]
    : [], [address]);

  const sendNotification = useNotification();

  // Helper function to convert degrees to radians
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  // Helper function to calculate distance between two lat/lng points in meters
  const getDistanceFromLatLonInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000; // Distance in meters
  };

  // Function to check if user is within 2km of any pin
  const checkProximity = useCallback(() => {
    if (!userLocation || pins.length === 0) {
      setIsWithinRange(false);
      return;
    }

    const [userLat, userLon] = userLocation;
    const isClose = pins.some((pin) => {
      const distance = getDistanceFromLatLonInMeters(
        userLat,
        userLon,
        pin.lat,
        pin.lng
      );
      return distance <= 2000; // 2km radius
    });
    setIsWithinRange(isClose);
  }, [userLocation, pins]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Handle error, e.g., permission denied
      },
      {
        enableHighAccuracy: true,
        timeout: 5000, // Increased timeout
        maximumAge: 0, // Ensure fresh location data
      }
    );

    // Cleanup watchPosition on component unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Re-check proximity whenever userLocation or pins change
  useEffect(() => {
    checkProximity();
  }, [checkProximity]);

  const handleSuccess = useCallback(async (response: TransactionResponse) => {
    const transactionHash = response.transactionReceipts[0].transactionHash;

    console.log(`Transaction successful: ${transactionHash}`);

    await sendNotification({
      title: "Congratulations!",
      body: `You sent your a transaction, ${transactionHash}!`,
    });
  }, [sendNotification]);

  return (
    <Card title="Make Your First Transaction">
      <div className="space-y-4">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          Experience the power of seamless sponsored transactions with{" "}
          <a
            href="https://onchainkit.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0052FF] hover:underline"
          >
            OnchainKit
          </a>
          .
        </p>

        <div className="flex flex-col items-center">
          {address ? (
            <Transaction
              calls={calls}
              onSuccess={handleSuccess}
              onError={(error: TransactionError) =>
                console.error("Transaction failed:", error)
              }
            >
              <TransactionButton className="text-white text-md" text="Collect Coin" disabled={!isWithinRange} />
              <TransactionStatus>
                <TransactionStatusAction />
                <TransactionStatusLabel />
              </TransactionStatus>
              <TransactionToast className="mb-4">
                <TransactionToastIcon />
                <TransactionToastLabel />
                <TransactionToastAction />
              </TransactionToast>
            </Transaction>
          ) : (
            <p className="text-yellow-400 text-sm text-center mt-2">
              Connect your wallet to send a transaction
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
