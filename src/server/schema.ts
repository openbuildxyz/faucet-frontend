import {
  bigint,
  bigserial,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  uid: bigint("uid", { mode: "number" }),
  avatar: text("avatar"),
  username: text("username"),
  email: text("email"),
  token: text("token"),
  tokenId: text("token_id"),
  github: text("github"),
  oauthToken: text("oauth_token"),
  oauthTokenId: text("oauth_token_id"),
});

export const transactions = pgTable(
  "transactions",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    address: text("address").notNull(),
    amount: text("amount").notNull(),
    txHash: text("tx_hash").notNull().default(""),
    status: text("status").notNull(),
    tokenSymbol: text("token_symbol").notNull(),
    chainType: text("chain_type").notNull(),
    chainId: text("chain_id"),
    rpcUrl: text("rpc_url"),
    errorMessage: text("error_message"),
    uid: bigint("uid", { mode: "number" }),
    github: text("github"),
  },
  (table) => [
    index("idx_transactions_address_token_created_at").on(
      table.address,
      table.tokenSymbol,
      table.createdAt,
    ),
    index("idx_transactions_uid_token_created_at").on(
      table.uid,
      table.tokenSymbol,
      table.createdAt,
    ),
    index("idx_transactions_github_token_created_at").on(
      table.github,
      table.tokenSymbol,
      table.createdAt,
    ),
  ],
);

export type User = typeof users.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
