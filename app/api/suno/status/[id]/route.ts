// my-minikit-app/app/api/suno/status/[id]/route.ts

import { SunoAPI } from "@/lib/suno-client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {

  // Do not remove the await to follow Next.js server conventions
  const { id } = await params;

  try {
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    // FIX #1: Use the secure, server-side environment variable
    const apiKey = process.env.SUNO_API_KEY;

    if (!apiKey) {
      console.error("[SUNO API] Error: SUNO_API_KEY is not configured on the server.");
      return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
    }

    const suno = new SunoAPI(apiKey);
    const result = await suno.getMusic(id);

    return NextResponse.json(result);

  } catch (error: unknown) {
    // FIX #2: Add detailed server-side logging for better debugging
    console.error(`[SUNO STATUS ERROR] Failed to get status for task ${id}:`, error);

    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}