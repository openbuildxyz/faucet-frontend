import type { NextApiRequest, NextApiResponse } from "next";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { readBearerToken } from "@/server/auth";
import {
  assertAddress,
  isFaucetToken,
  sendFaucetTransaction,
  type FaucetToken,
} from "@/server/chain";
import {
  amountForGithub,
  ClaimError,
  markClaimCompleted,
  markClaimFailed,
  reserveClaim,
} from "@/server/faucet";
import { getDb } from "@/server/db";
import { applyCors, fail, handleApiError, methodNotAllowed, ok } from "@/server/http";
import type { ApiResponse } from "@/server/http";
import { users } from "@/server/schema";

export const config = {
  maxDuration: 60,
};

const faucetRequestSchema = z.object({
  address: z.string().min(1),
  token: z.string().min(1),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ address: string; tx: string }>>,
) {
  applyCors(req, res);
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  let claimId: number | undefined;

  try {
    const oauthToken = await readBearerToken(req);
    if (!oauthToken) {
      return fail(res, 401, "Please log in to continue!");
    }

    const { address, token } = faucetRequestSchema.parse(req.body);
    assertAddress(address);
    if (!isFaucetToken(token)) {
      return fail(res, 400, `Invalid token: ${token}`);
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
    if (!user.github) {
      return fail(res, 400, "Please bind your GitHub in OpenBuiild first");
    }

    const faucetToken = token as FaucetToken;
    const amount = await amountForGithub(user.github, faucetToken);
    const claim = await reserveClaim({
      address,
      amount,
      token: faucetToken,
      user,
    });
    claimId = claim.id;

    const txHash = await sendFaucetTransaction(address, faucetToken, amount);
    await markClaimCompleted(claim.id, txHash);

    return ok(res, {
      address,
      tx: txHash,
    });
  } catch (error) {
    if (claimId) {
      await markClaimFailed(claimId, error);
    }

    if (error instanceof ClaimError) {
      return fail(res, 400, error.message);
    }
    if (error instanceof Error && error.message.startsWith("Invalid address:")) {
      return fail(res, 400, error.message);
    }
    if (
      error instanceof Error &&
      (error.message.includes("GitHub") || error.message.includes("Rank"))
    ) {
      return fail(res, 500, error.message);
    }

    return handleApiError(res, error);
  }
}
