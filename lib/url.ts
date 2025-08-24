// /lib/url.ts or /utils/url.ts

/**
 * Constructs an absolute URL for a given path, adapting to the deployment environment.
 * @param path - The internal path, e.g., '/api/suno-callback'.
 * @returns A full, absolute URL.
 */
export const getAbsoluteUrl = (path: string): string => {
  // 1. Check for a manually set, canonical site URL (for non-Vercel platforms).
  // This should be set in your environment variables.
  if (process.env.SITE_URL) {
    return `${process.env.SITE_URL}${path}`;
  }

  // 2. Check for Vercel's system environment variable.
  // This is automatically set on Vercel deployments.
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}`;
  }

  // 3. Fallback to localhost for local development.
  // Ensure you are using a tunneling service like ngrok for webhook testing.
  return `http://localhost:${process.env.PORT?? 3000}${path}`;
};
