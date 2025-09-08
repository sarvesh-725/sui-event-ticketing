import { SuiClient } from "@mysten/sui/client";

export const NETWORK_CONFIG = {
  testnet: {
    rpcUrl: "https://fullnode.testnet.sui.io:443",
    wsUrl: "wss://fullnode.testnet.sui.io:443",
    faucetUrl: "https://faucet.testnet.sui.io/gas",
  },
  mainnet: {
    rpcUrl: "https://fullnode.mainnet.sui.io:443",
    wsUrl: "wss://fullnode.mainnet.sui.io:443",
  },
  localnet: {
    rpcUrl: "http://127.0.0.1:9000",
    wsUrl: "ws://127.0.0.1:9000",
  },
} as const;


export const CURRENT_NETWORK = "testnet" as keyof typeof NETWORK_CONFIG;

export const suiClient = new SuiClient({
  url: NETWORK_CONFIG[CURRENT_NETWORK].rpcUrl,
});

export const getNetworkInfo = () => {
  return {
    name: CURRENT_NETWORK,
    rpcUrl: NETWORK_CONFIG[CURRENT_NETWORK].rpcUrl,
    wsUrl: NETWORK_CONFIG[CURRENT_NETWORK].wsUrl,
  };
};
