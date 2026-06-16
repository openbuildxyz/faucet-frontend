import type { NextApiRequest, NextApiResponse } from "next";
import { desc, eq } from "drizzle-orm";
import { readBearerToken } from "@/server/auth";
import { getDb } from "@/server/db";
import { applyCors, fail, handleApiError, methodNotAllowed, ok } from "@/server/http";
import type { ApiResponse } from "@/server/http";
import { requestOpenBuildUser } from "@/server/oauth";
import { users, type User } from "@/server/schema";

export const config = {
  maxDuration: 60,
};

function publicUser(user: User) {
  return {
    uid: user.uid,
    avatar: user.avatar || "",
    username: user.username || "",
    email: user.email || "",
    github: user.github || "",
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ReturnType<typeof publicUser>>>,
) {
  applyCors(req, res);
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "GET") {
    return methodNotAllowed(res);
  }

  try {
    const oauthToken = await readBearerToken(req);
    if (!oauthToken) {
      return fail(res, 401, "Please log in to continue!");
    }

    const db = getDb();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.oauthToken, oauthToken))
      .orderBy(desc(users.createdAt))
      .limit(1);

    if (!user) {
      return fail(res, 401, "Please log in to continue!");
    }

    const openBuildUser = await requestOpenBuildUser(oauthToken);
    const [updatedUser] = await db
      .update(users)
      .set({
        uid: openBuildUser.uid,
        avatar: openBuildUser.avatar,
        email: openBuildUser.email,
        username: openBuildUser.username,
        github: openBuildUser.github,
        oauthTokenId: openBuildUser.id,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();

    return ok(res, publicUser(updatedUser || user));
  } catch (error) {
    return handleApiError(res, error);
  }
}
