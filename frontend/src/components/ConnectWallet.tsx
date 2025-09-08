import React from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { formatAddress } from "../utils/suiHelpers";

export const ConnectWallet: React.FC = () => {
  const account = useCurrentAccount();

  return (
    <div className="flex items-center space-x-4">
      {account ? (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">
              Connected
            </span>
          </div>
          <div className="px-3 py-1 bg-gray-100 rounded-lg">
            <code className="text-sm text-gray-700 font-mono">
              {formatAddress(account.address)}
            </code>
          </div>
          <ConnectButton
            connectText="Disconnect"
            className="!bg-red-600 hover:!bg-red-700 !text-white !px-4 !py-2 !rounded-lg !font-medium !transition-colors !text-sm"
          />
        </div>
      ) : (
        <ConnectButton
          connectText="Connect Wallet"
          className="!bg-blue-600 hover:!bg-blue-700 !text-white !px-6 !py-2 !rounded-lg !font-medium !transition-colors"
        />
      )}
    </div>
  );
};
