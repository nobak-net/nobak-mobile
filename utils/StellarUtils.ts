import { Keypair } from '@stellar/stellar-base';

// Function to create a new Stellar Keypair
export function createStellarKeypair() {
  // Generate a new keypair
  const keypair = Keypair.random();

  // Get the public and secret keys in the correct format
  const publicKey = keypair.publicKey();
  const secretKey = keypair.secret();

  return {
    publicKey,
    secretKey,
  };
}

export const formatPublicKey = (publicKey: string) => {
  if (publicKey.length <= 10) return publicKey; // In case the key is too short
  return `${publicKey.slice(0, 5)}...${publicKey.slice(-5)}`;
};