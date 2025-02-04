import Button from './Button';
import { toast } from 'react-toastify';
import interactImg from '../../../assets/interact.svg';
import { useConvex, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ConvexError } from 'convex/values';
import { Id } from '../../../convex/_generated/dataModel';
import { useCallback, useEffect, useState } from 'react';
import { waitForInput } from '../../hooks/sendInput';
import { useServerGame } from '../../hooks/serverGame';
import { getWalletTokens } from '../WalletComponent';
import { useWallet } from '@jup-ag/wallet-adapter';

export default function InteractButton() {
  const { connected, publicKey } = useWallet();
  const [hasEnoughTokens, setHasEnoughTokens] = useState<boolean>(false);
  const [isCheckingTokens, setIsCheckingTokens] = useState<boolean>(true);

  const worldStatus = useQuery(api.world.defaultWorldStatus);
  const worldId = worldStatus?.worldId;
  const game = useServerGame(worldId);
  const walletShort = publicKey ? publicKey.toString().slice(0, 6) : null;
  const userPlayerId =
    game && [...game.world.players.values()].find((p) => p.human === walletShort)?.id;
  const join = useMutation(api.world.joinWorld);
  const leave = useMutation(api.world.leaveWorld);
  const isPlaying = !!userPlayerId;

  useEffect(() => {
    const checkTokens = async () => {
      if (!connected || !publicKey) {
        setHasEnoughTokens(false);
        setIsCheckingTokens(false);
        return;
      }

      try {
        const tokenAmount = await getWalletTokens(publicKey.toString());
        setHasEnoughTokens(tokenAmount > 1000); // token amount to play
      } catch (error) {
        console.error('Error checking tokens:', error);
        setHasEnoughTokens(false);
      } finally {
        setIsCheckingTokens(false);
      }
    };

    checkTokens();
  }, [connected, publicKey]);

  const convex = useConvex();
  const joinInput = useCallback(
    async (worldId: Id<'worlds'>) => {
      if (!publicKey) return;

      let inputId;
      try {
        const walletShort = publicKey.toString().slice(0, 6);
        inputId = await join({ worldId, walletAddress: walletShort });
      } catch (e: any) {
        if (e instanceof ConvexError) {
          toast.error(e.data);
          return;
        }
        throw e;
      }
      try {
        await waitForInput(convex, inputId);
      } catch (e: any) {
        toast.error(e.message);
      }
    },
    [convex, join, publicKey],
  );

  const joinOrLeaveGame = () => {
    if (!worldId || game === undefined || !walletShort) {
      return;
    }
    if (isPlaying) {
      console.log(`Leaving game for player ${userPlayerId}`);
      void leave({ worldId, walletAddress: walletShort });
    } else {
      console.log(`Joining game`);
      void joinInput(worldId);
    }
  };

  if (isCheckingTokens) {
    return null;
  }

  if (hasEnoughTokens) {
    return (
      <Button imgUrl={interactImg} onClick={joinOrLeaveGame}>
        {isPlaying ? 'Leave' : 'Interact'}
      </Button>
    );
  }

  return null;
}
