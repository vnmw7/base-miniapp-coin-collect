// lib/suno-client.ts

export class SunoAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Suno API key is required.");
    }
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.kie.ai/api/v1';
  }

  async generateMusic(prompt: string, options: any = {}, callBackUrl: string, correlationId: string) {
    console.log(`[Suno] Generating music for prompt: "${prompt}" with correlationId: ${correlationId}`);
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          customMode: false,
          ...options,
          callBackUrl,
          customData: { correlationId },
        })
      });

      const result = await response.json();
      if (!response.ok || result.code !== 200) {
        const errorMsg = `Generation failed for correlationId ${correlationId}: ${result.msg || 'Unknown error'}`;
        console.error(`[Suno] Error: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      console.log(`[Suno] Successfully started music generation for correlationId: ${correlationId}`);
      return result.data;
    } catch (error) {
      console.error(`[Suno] Network or unexpected error during music generation for correlationId ${correlationId}:`, error);
      throw error;
    }
  }

  async getMusic(taskId: string) {
    // FIX #3: Corrected the endpoint URL for checking task status
    const response = await fetch(`${this.baseUrl}/generate/record-info?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      }
    });

    // FIX #4: Enhanced error handling to be more descriptive
    if (!response.ok) {
      // This handles HTTP errors like 401 Unauthorized, 404 Not Found, etc.
      const errorBody = await response.text();
      console.error(`Kie.ai API Error: Status ${response.status}`, errorBody);
      throw new Error(`API provider returned an error. Status: ${response.status}`);
    }

    const result = await response.json();

    // This handles errors reported within a successful (200 OK) response body
    if (result.code !== 200) {
      throw new Error(`API provider reported an issue: ${result.msg || 'Unspecified error'}`);
    }

    return result.data;
  }

  // ... include the other methods like extendMusic, generateLyrics, etc.
}