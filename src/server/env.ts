import { z } from "zod";

const trimString = <T extends z.ZodType<string>>(schema: T) =>
  z.preprocess((value) => (typeof value === "string" ? value.trim() : value), schema);

const envSchema = z.object({
  DATABASE_URL: trimString(z.string().min(1)),
  JWT_SECRET: trimString(z.string().min(16)),
  OAUTH_CLIENT_ID: trimString(z.string().min(1)),
  OAUTH_CLIENT_SECRET: trimString(z.string().min(1)),
  OAUTH_ACCESS_API: trimString(z.string().url()),
  OAUTH_GET_USER: trimString(z.string().url()),
  FAUCET_PRIVATE_KEY: trimString(z.string().min(1)),
  FAUCET_ZEROG_PRIVATE_KEY: trimString(z.string().min(1)).optional(),
  RPC_MONAD_DEVNET: trimString(z.string().url()),
  RPC_ZERO_TESTNET: trimString(z.string().url()),
  RPC_CAMP_TESTNET: trimString(z.string().url()),
  RPC_NEXUS_TESTNET: trimString(z.string().url()),
  ALLOWED_ORIGINS: trimString(z.string()).optional(),
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
