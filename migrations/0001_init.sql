CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  uid BIGINT,
  avatar TEXT,
  username TEXT,
  email TEXT,
  token TEXT,
  token_id TEXT,
  github TEXT,
  oauth_token TEXT,
  oauth_token_id TEXT
);

CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  address TEXT NOT NULL,
  amount TEXT NOT NULL,
  tx_hash TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  chain_type TEXT NOT NULL,
  chain_id TEXT,
  rpc_url TEXT,
  error_message TEXT,
  uid BIGINT,
  github TEXT
);

CREATE INDEX IF NOT EXISTS idx_transactions_address_token_created_at
  ON transactions(address, token_symbol, created_at);

CREATE INDEX IF NOT EXISTS idx_transactions_uid_token_created_at
  ON transactions(uid, token_symbol, created_at);

CREATE INDEX IF NOT EXISTS idx_transactions_github_token_created_at
  ON transactions(github, token_symbol, created_at);
