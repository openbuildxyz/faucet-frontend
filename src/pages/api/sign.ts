import type { NextApiRequest, NextApiResponse } from "next";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { generateToken } from "@/server/auth";
import { getDb } from "@/server/db";
import { applyCors, fail, handleApiError, methodNotAllowed, ok } from "@/server/http";
import type { ApiResponse } from "@/server/http";
import { requestOpenBuildAccessToken } from "@/server/oauth";
import { users } from "@/server/schema";

export const config = {
  maxDuration: 60,
};

const signRequestSchema = z.object({
  code: z.string().min(1),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ token: string }>>,
) {
  applyCors(req, res);
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  try {
    const { code } = signRequestSchema.parse(req.body);
    const oauthToken = await requestOpenBuildAccessToken(code);
    const db = getDb();

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.oauthToken, oauthToken))
      .orderBy(desc(users.createdAt))
      .limit(1);

    if (!existingUser) {
      await db.insert(users).values({
        oauthToken,
      });
    }

    return ok(res, {
      token: await generateToken(oauthToken),
    });
  } catch (error) {
    return handleApiError(res, error);
  }
}
