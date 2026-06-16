import { createWalletClient, defineChain, http, isAddress, parseEther } from "viem";
import type { Address, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { getServerEnv } from "./env";

export const faucetTokens = ["MON", "0G", "CAMP", "NEX"] as const;
export type FaucetToken = (typeof faucetTokens)[number];

export function isFaucetToken(token: string): token is FaucetToken {
  return faucetTokens.includes(token as FaucetToken);
}

export function assertAddress(address: string): asserts address is Address {
  if (!isAddress(address)) {
    throw new Error(`Invalid address: ${address}`);
  }
}

function normalizePrivateKey(privateKey: string): Hex {
  return (privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`) as Hex;
}

export function getChainConfig(token: FaucetToken) {
  const env = getServerEnv();

  switch (token) {
    case "MON":
      return {
        id: 10143,
        name: "Monad Devnet",
        rpcUrl: env.RPC_MONAD_DEVNET,
        privateKey: env.FAUCET_PRIVATE_KEY,
      };
    case "0G":
      return {
        id: 16601,
        name: "0G Testnet",
        rpcUrl: env.RPC_ZERO_TESTNET,
        privateKey: env.FAUCET_ZEROG_PRIVATE_KEY || env.FAUCET_PRIVATE_KEY,
      };
    case "CAMP":
      return {
        id: 123420001114,
        name: "Camp Testnet",
        rpcUrl: env.RPC_CAMP_TESTNET,
        privateKey: env.FAUCET_PRIVATE_KEY,
      };
    case "NEX":
      return {
        id: 3940,
        name: "Nexus Testnet",
        rpcUrl: env.RPC_NEXUS_TESTNET,
        privateKey: env.FAUCET_PRIVATE_KEY,
      };
  }
}

export async function sendFaucetTransaction(
  address: Address,
  token: FaucetToken,
  amount: string,
) {
  const chainConfig = getChainConfig(token);
  const account = privateKeyToAccount(normalizePrivateKey(chainConfig.privateKey));
  const chain = defineChain({
    id: chainConfig.id,
    name: chainConfig.name,
    nativeCurrency: {
      decimals: 18,
      name: token,
      symbol: token,
    },
    rpcUrls: {
      default: {
        http: [chainConfig.rpcUrl],
      },
    },
  });

  const client = createWalletClient({
    account,
    chain,
    transport: http(chainConfig.rpcUrl),
  });

  return client.sendTransaction({
    account,
    chain,
    to: address,
    value: parseEther(amount),
  });
}
