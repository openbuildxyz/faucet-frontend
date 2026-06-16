import { z } from "zod";
import { getServerEnv } from "./env";

const accessTokenResponseSchema = z.object({
  status: z.number(),
  code: z.number().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  message: z.string().optional(),
  id: z.string().optional(),
}).passthrough();

const getUserResponseSchema = z.object({
  id: z.string().optional(),
  status: z.number(),
  code: z.number().optional(),
  data: z.record(z.string(), z.unknown()),
  message: z.string().optional(),
}).passthrough();

function stringValue(value: unknown) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return "";
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export async function requestOpenBuildAccessToken(code: string) {
  const env = getServerEnv();
  const response = await fetch(env.OAUTH_ACCESS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: env.OAUTH_CLIENT_ID,
      client_secret: env.OAUTH_CLIENT_SECRET,
      code,
    }),
  });

  const payload = accessTokenResponseSchema.parse(await response.json());
  if (payload.status !== 200) {
    throw new Error(payload.message || "OpenBuild OAuth failed");
  }

  const data = payload.data || {};
  const token =
    data.token ||
    data.access_token ||
    data.accessToken ||
    payload.token ||
    payload.access_token ||
    payload.accessToken;

  if (typeof token !== "string" || !token) {
    console.error("OpenBuild OAuth response missing token:", {
      topLevelKeys: Object.keys(payload),
      dataKeys: Object.keys(data),
      status: payload.status,
      code: payload.code,
      message: payload.message,
    });
    throw new Error("OpenBuild OAuth response missing token");
  }

  return token;
}

export async function requestOpenBuildUser(oauthToken: string) {
  const response = await fetch(getServerEnv().OAUTH_GET_USER, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${oauthToken}`,
    },
  });

  const payload = getUserResponseSchema.parse(await response.json());
  if (payload.status !== 200) {
    throw new Error(payload.message || "OpenBuild user request failed");
  }

  const data = payload.data || {};
  const uid = numberValue(data.uid);
  if (!uid) {
    console.error("OpenBuild user response missing uid:", {
      topLevelKeys: Object.keys(payload),
      dataKeys: Object.keys(data),
      status: payload.status,
      code: payload.code,
      message: payload.message,
    });
    throw new Error("OpenBuild user response missing uid");
  }

  return {
    id: payload.id,
    uid,
    avatar: stringValue(data.avatar),
    username: stringValue(data.user_name || data.username || data.name),
    email: stringValue(data.email),
    github: stringValue(data.github || data.github_username || data.githubName),
  };
}
