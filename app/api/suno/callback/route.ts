// /app/api/suno-callback/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSong } from '@/lib/song-store';

// Payload interface remains the same.
interface SunoCallbackPayload {
  status: 'complete' | 'error';
  audio_url?: string;
  video_url?: string;
  metadata?: any;
  error_message?: string;
  correlationId?: string;
}

export async function POST(req: NextRequest) {
  // 1. Security Validation (as above)
  const providerSecret = process.env.SUNO_WEBHOOK_SECRET;
  const requestSecret = req.headers.get('x-webhook-secret');
  if (providerSecret && requestSecret!== providerSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = (await req.json()) as SunoCallbackPayload;

    // 2. Process the Payload
    console.log('Received Suno callback:', payload);

    if (payload.correlationId) {
      if (payload.status === 'complete') {
        await updateSong(payload.correlationId, {
          status: 'completed',
          audioUrl: payload.audio_url,
        });
      } else {
        await updateSong(payload.correlationId, {
          status: 'failed',
          error: payload.error_message,
        });
      }
    }

    // 3. Acknowledge Receipt
    return NextResponse.json({ status: 'received' }, { status: 200 });

  } catch (error) {
    console.error('Error processing Suno callback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
