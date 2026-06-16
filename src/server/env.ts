import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  OAUTH_CLIENT_ID: z.string().min(1),
  OAUTH_CLIENT_SECRET: z.string().min(1),
  OAUTH_ACCESS_API: z.string().url(),
  OAUTH_GET_USER: z.string().url(),
  FAUCET_PRIVATE_KEY: z.string().min(1),
  FAUCET_ZEROG_PRIVATE_KEY: z.string().min(1).optional(),
  RPC_MONAD_DEVNET: z.string().url(),
  RPC_ZERO_TESTNET: z.string().url(),
  RPC_CAMP_TESTNET: z.string().url(),
  RPC_NEXUS_TESTNET: z.string().url(),
  ALLOWED_ORIGINS: z.string().optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cachedEnv: ServerEnv | undefined;

export function getServerEnv() {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }
  return cachedEnv;
}

export function getAllowedOrigins() {
  const origins = process.env.ALLOWED_ORIGINS;
  if (!origins) {
    return [];
  }
  return origins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
