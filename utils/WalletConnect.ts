import "@walletconnect/react-native-compat";
import "@ethersproject/shims";
import Constants from 'expo-constants';
import { Core } from "@walletconnect/core";
import { ICore } from "@walletconnect/types";
import { Web3Wallet, IWeb3Wallet } from "@walletconnect/web3wallet";

export let web3wallet: IWeb3Wallet;
export let core: ICore;
export let currentETHAddress: string;

import { useState, useCallback, useEffect } from "react";

async function createWeb3Wallet() {
  const { WC_ENV_PROJECT_ID } = Constants.expoConfig?.extra  || {};

  const ENV_PROJECT_ID = WC_ENV_PROJECT_ID
  
  const core = new Core({
    projectId: ENV_PROJECT_ID,
  });

  // Edit the metadata to your preference
  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: "NOBAK",
      description: "NOBAK",
      url: "https://nobak.net/",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
  });
}

// Initialize the Web3Wallet
export function useInitialization() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true; // This flag is used to avoid state updates after unmount

    const initialize = async () => {
      try {
        await createWeb3Wallet();
        if (isMounted) setInitialized(true);
      } catch (err) {
        console.log("Error initializing Web3Wallet", err);
      }
    };

    if (!initialized) {
      initialize();
    }

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, [initialized]);

  return initialized;
}

export async function web3WalletPair(params: { uri: string }) {
  return await web3wallet.core.pairing.pair({ uri: params.uri });
}