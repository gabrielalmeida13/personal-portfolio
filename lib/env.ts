import { z } from "zod";

const serverEnvSchema = z.object({
  GITHUB_TOKEN: z.string().min(1),
  GITHUB_USERNAME: z.string().min(1),
  SPOTIFY_CLIENT_ID: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),
  SPOTIFY_REFRESH_TOKEN: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),
  CONTACT_EMAIL: z.string().email(),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

function parseEnv() {
  const serverResult = serverEnvSchema.safeParse(process.env);
  const publicResult = publicEnvSchema.safeParse(process.env);

  const errors: string[] = [];

  if (!serverResult.success) {
    errors.push(...serverResult.error.issues.map((i) => i.path.join(".") + ": " + i.message));
  }

  if (!publicResult.success) {
    errors.push(...publicResult.error.issues.map((i) => i.path.join(".") + ": " + i.message));
  }

  if (errors.length > 0) {
    throw new Error(
      "[env] Missing or invalid environment variables:\n" + errors.map((e) => "  - " + e).join("\n")
    );
  }

  return {
    ...serverResult.data!,
    ...publicResult.data!,
  };
}

export const env = parseEnv();
