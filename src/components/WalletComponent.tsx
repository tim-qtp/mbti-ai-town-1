import { UnifiedWalletButton, useWallet } from '@jup-ag/wallet-adapter';
import { useCallback, useState } from 'react';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import Button from './buttons/Button';
import * as buffer from 'buffer';
window.Buffer = buffer.Buffer;

export function ConnectWalletButton() {
  const { connected, disconnect } = useWallet();

  return (
    <>
      {!connected ? (
        <div className="flex  justify-center text-white shadow-solid  pointer-events-auto connect-wallet">
          <UnifiedWalletButton />
        </div>
      ) : (
        <div className="connect-wallet ">
          <button
            className="flex p-3 justify-center text-white shadow-solid  pointer-events-auto "
            onClick={disconnect}
          >
            Disconnect
          </button>
        </div>
      )}
    </>
  );
}

export async function getBalance(address: string): Promise<number> {
  const connection = new Connection(
    'https://grateful-jerrie-fast-mainnet.helius-rpc.com',
    'confirmed',
  );

  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
}

export function SendSolButton({ recipientAddress }: { recipientAddress: string }) {
  const { publicKey, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendSol = useCallback(async () => {
    if (!publicKey || !signTransaction) return;

    setIsLoading(true);
    const connection = new Connection(
      'https://grateful-jerrie-fast-mainnet.helius-rpc.com',
      'confirmed',
    );
    const recipient = new PublicKey(recipientAddress); // Replace with your hardcoded address

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: 0.01 * LAMPORTS_PER_SOL,
        }),
      );

      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTransaction = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());

      console.log(`Transaction sent: https://explorer.solana.com/tx/${txid}`);
      // You might want to show a success message to the user here
    } catch (error) {
      console.error('Error sending transaction:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signTransaction]);

  if (!publicKey) return null;

  return (
    <button
      className="flex  justify-center  button text-xs bg-clay-700 text-white rounded-xl  pointer-events-auto"
      onClick={handleSendSol}
      disabled={isLoading}
    >
      {isLoading ? 'Sending...' : 'Vote'}
    </button>
  );
}
