import { and, desc, eq, gte, isNull, sql } from "drizzle-orm";
import { getDb } from "./db";
import { getChainConfig, type FaucetToken } from "./chain";
import { transactions, type User } from "./schema";

const dayMs = 24 * 60 * 60 * 1000;

export class ClaimError extends Error {}

function parseGitRank(content: string) {
  const title = content.match(/<title.*?>(.*?)<\/title>/)?.[1];
  const rank = title?.match(/Rank:\s*(\w)/)?.[1];

  if (!rank) {
    throw new Error("Can't parse GitHub Rank");
  }

  return rank;
}

export async function requestGitRank(github: string) {
  const response = await fetch(
    `https://github-readme-stats.vercel.app/api?username=${encodeURIComponent(github)}`,
  );

  if (!response.ok) {
    throw new Error("Can't get GitHub Rank");
  }

  return parseGitRank(await response.text());
}

export async function amountForGithub(github: string, token: FaucetToken) {
  const rank = await requestGitRank(github);
  const nexusAmounts: Record<string, string> = {
    S: "5",
    A: "4",
    B: "3.5",
    C: "3",
  };
  const defaultAmounts: Record<string, string> = {
    S: "1",
    A: "0.4",
    B: "0.3",
    C: "0.1",
  };

  const amount = token === "NEX" ? nexusAmounts[rank] : defaultAmounts[rank];
  if (!amount) {
    throw new Error("GitHub's rank is invalid");
  }

  return amount;
}

async function hasRecentClaim(
  tx: Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0],
  where: ReturnType<typeof and>,
) {
  const cutoff = new Date(Date.now() - dayMs);
  const [existing] = await tx
    .select({ id: transactions.id })
    .from(transactions)
    .where(and(where, gte(transactions.createdAt, cutoff), isNull(transactions.deletedAt)))
    .orderBy(desc(transactions.createdAt))
    .limit(1);

  return Boolean(existing);
}

export async function reserveClaim(params: {
  address: string;
  amount: string;
  token: FaucetToken;
  user: User;
}) {
  const db = getDb();
  const chainConfig = getChainConfig(params.token);
  const normalizedAddress = params.address.toLowerCase();
  const github = params.user.github || "";

  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`faucet:${params.token}:address:${normalizedAddress}`}))`,
    );
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`faucet:${params.token}:uid:${params.user.uid}`}))`,
    );
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`faucet:${params.token}:github:${github}`}))`,
    );

    if (
      await hasRecentClaim(
        tx,
        and(
          sql`lower(${transactions.address}) = ${normalizedAddress}`,
          eq(transactions.tokenSymbol, params.token),
        ),
      )
    ) {
      throw new ClaimError("You has already made a request in 24 hours. Please try again later.");
    }

    if (
      params.user.uid &&
      (await hasRecentClaim(
        tx,
        and(eq(transactions.uid, params.user.uid), eq(transactions.tokenSymbol, params.token)),
      ))
    ) {
      throw new ClaimError("You has already made a request in 24 hours. Please try again later.");
    }

    if (
      github &&
      (await hasRecentClaim(
        tx,
        and(eq(transactions.github, github), eq(transactions.tokenSymbol, params.token)),
      ))
    ) {
      throw new ClaimError("You has already made a request in 24 hours. Please try again later.");
    }

    const [created] = await tx
      .insert(transactions)
      .values({
        address: normalizedAddress,
        amount: params.amount,
        status: "pending",
        tokenSymbol: params.token,
        chainType: "evm",
        chainId: String(chainConfig.id),
        rpcUrl: chainConfig.rpcUrl,
        uid: params.user.uid,
        github,
      })
      .returning();

    return created;
  });
}

export async function markClaimCompleted(id: number, txHash: string) {
  const db = getDb();
  await db
    .update(transactions)
    .set({
      status: "completed",
      txHash,
      updatedAt: new Date(),
    })
    .where(eq(transactions.id, id));
}

export async function markClaimFailed(id: number, error: unknown) {
  const db = getDb();
  await db
    .update(transactions)
    .set({
      status: "failed",
      errorMessage: error instanceof Error ? error.message : String(error),
      updatedAt: new Date(),
    })
    .where(eq(transactions.id, id));
}
