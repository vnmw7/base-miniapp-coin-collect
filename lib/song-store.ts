// lib/song-store.ts

import { Redis } from '@upstash/redis';

// Initialize the client outside of your functions
const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

interface Song {
  id: string;
  prompt: string;
  status: 'generating' | 'completed' | 'failed';
  audioUrl?: string;
  error?: string;
}

// Key for storing the song hash in Redis
const songKey = (id: string) => `song:${id}`;

export const getSong = async (id: string): Promise<Song | null> => {
  const songData = await redis.hgetall(songKey(id));
  if (!songData) {
    return null;
  }
  return songData as Song;
};

export const setSong = async (id: string, song: Song) => {
  await redis.hset(songKey(id), song);
};

export const updateSong = async (id: string, updates: Partial<Song>) => {
  const song = await getSong(id);
  if (song) {
    const updateData = { ...song, ...updates };
    await redis.hset(songKey(id), updateData);
  }
};