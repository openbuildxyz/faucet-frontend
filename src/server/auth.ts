import type { NextApiRequest } from "next";
import { jwtVerify, SignJWT } from "jose";
import { getServerEnv } from "./env";

const encoder = new TextEncoder();

function jwtSecret() {
  return encoder.encode(getServerEnv().JWT_SECRET);
}

export async function generateToken(oauthToken: string) {
  return new SignJWT({ oauth_token: oauthToken })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(jwtSecret());
}

export async function readBearerToken(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  const { payload } = await jwtVerify(token, jwtSecret());
  const oauthToken = payload.oauth_token;

  return typeof oauthToken === "string" ? oauthToken : null;
}
