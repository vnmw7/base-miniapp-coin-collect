import { NextResponse } from 'next/server';
import { getAbsoluteUrl } from '@/lib/url';
import { SunoAPI } from '@/lib/suno-client';
import { setSong } from '@/lib/song-store';

export async function POST(req: Request) {
  const { prompt, options } = await req.json();

  // 1. Construct the absolute callback URL using the utility function.
  const callBackUrl = getAbsoluteUrl('/api/suno/callback');
  
  // Log the URL for debugging purposes.
  console.log(`Using callback URL: ${callBackUrl}`);

  // This is a unique identifier you can use to match the callback to the original request.
  const correlationId = crypto.randomUUID();

  await setSong(correlationId, {
    id: correlationId,
    prompt,
    status: 'generating',
  });

  try {
    // 2. Make the request to the third-party Suno API provider.
    const suno = new SunoAPI(process.env.SUNO_API_KEY || '');
    const sunoApiResponse = await suno.generateMusic(prompt, options, callBackUrl, correlationId);

    // 3. Respond to the client immediately.
    // The actual song data will arrive later via the webhook.
    return NextResponse.json({
      message: 'Song generation initiated.',
      taskId: sunoApiResponse.taskId, // The provider might return a task ID
      correlationId: correlationId,
    }, { status: 202 });

  } catch (error) {
    console.error('Failed to initiate song generation:', error);
    return NextResponse.json({ error: 'Failed to initiate song generation.' }, { status: 500 });
  }
}
