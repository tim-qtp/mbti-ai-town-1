import Game from './components/Game.tsx';

import { ToastContainer } from 'react-toastify';

import xImg from '../assets/xlogo.svg';
import gitLogo from '../assets/githublogo.svg';
import helpImg from '../assets/help.svg';
import closeImg from '../assets/closeblack.svg';
// import { UserButton } from '@clerk/clerk-react';
// import { Authenticated, Unauthenticated } from 'convex/react';
// import LoginButton from './components/buttons/LoginButton.tsx';
import { useEffect, useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import MusicButton from './components/buttons/MusicButton.tsx';
import Button from './components/buttons/Button.tsx';
import { Adapter, UnifiedWalletProvider, WalletName } from '@jup-ag/wallet-adapter';
import { useWrappedReownAdapter } from '@jup-ag/jup-mobile-adapter';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import { ConnectWalletButton } from './components/WalletComponent.tsx';
import InteractButton from './components/buttons/InteractButton.tsx';
// import InteractButton from './components/buttons/InteractButton.tsx';
// import FreezeButton from './components/FreezeButton.tsx';
// import { MAX_HUMAN_PLAYERS } from '../convex/constants.ts';

export default function Home() {
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [isGameMounted, setIsGameMounted] = useState(false);

  const { reownAdapter, jupiterAdapter } = useWrappedReownAdapter({
    appKitOptions: {
      metadata: {
        name: 'Artificial Island',
        description: 'Connect to interact with the agents if you own 1m or more $clams.',
        url: 'https://artificialisle.lol', // origin must match your domain & subdomain
        icons: [''],
      },
      projectId: '348609c02abbbbd74c3ea5a77c74e4ac',
      features: {
        analytics: false,
        socials: ['x'],
        email: false,
      },
      enableWallets: false,
    },
  });

  // Move wallets array to useMemo without the Hook inside
  const wallets: Adapter[] = useMemo(() => {
    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      reownAdapter,
      jupiterAdapter,
    ].filter((item) => item && item.name && item.icon) as Adapter[];
  }, [reownAdapter, jupiterAdapter]);

  // Create an effect to watch the Game's output
  useEffect(() => {
    const checkGameContent = () => {
      const gameContent = document.querySelector('.flex.flex-col.h-screen.w-full');
      if (gameContent) {
        setIsGameMounted(true);
      }
    };

    // Check initially
    checkGameContent();

    // Set up an observer to watch for the game content
    const observer = new MutationObserver(checkGameContent);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const createWalletName = (name: string): WalletName => {
    return name as WalletName;
  };

  return (
    <UnifiedWalletProvider
      wallets={wallets}
      config={{
        autoConnect: false,
        env: 'mainnet-beta',
        metadata: {
          name: 'ai',
          description: 'ai',
          url: 'https://artificialisle.lol',
          iconUrls: ['https://www.artificialisle.lol/favicon.ico'],
        },
        theme: 'dark',

        walletlistExplanation: {
          href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
        },
        lang: 'en',
      }}
    >
      <main className="relative flex min-h-screen flex-col items-center justify-between font-body game-">
        {helpModalOpen && (
          <a
            onClick={() => setHelpModalOpen(false)}
            className="button absolute right-2  top-2 z-50 text-white shadow-solid text-2xl cursor-pointer pointer-events-auto"
          >
            <h2 className="h-full bg-clay-700">
              <img className="w-4 h-4 sm:w-5 sm:h-5" src={closeImg} />
            </h2>
          </a>
        )}
        <ReactModal
          isOpen={helpModalOpen}
          onRequestClose={() => setHelpModalOpen(false)}
          className="bg-clay-900 mt-10 lg:mt-10 mx-10 lg:mx-56 p-1 lg:p-10 pb-10 px-10 border-4 border-black max-h-[90vh] overflow-y-auto"
          contentLabel="Help "
          ariaHideApp={false}
        >
        <div className="font-body pb-4">
            <h1 className="text-center text-6xl font-bold font-display game-title">Welcome to MBTI AI TOWN!</h1>
            <h2 className="text-xl my-2">Ever wondered what would happen if you put 16 MBTI AI personalities in a town together? Well, now you can find out!</h2>
            <p>
                What is This?
            </p>
            <h2 className="text-2xl mt-4">MBTI AI TOWN is an interactive game show where MBTI AI Agents with distinct personalities live, interact, and compete for your support. Watch as they roam around their pixelated paradise, engage in conversations, and form unique relationships.</h2>
            <h2 className="text-2xl mt-4">How It Works</h2>
            <ul className="list-disc pl-4">
                <li>Each MBTI AI agent has their own unique personality and behavior patterns</li>
                <li>Watch them explore the town and chat with each other in real-time</li>
                <li>Click on any MBTI agent to see their most recent chat history</li>
                <li>Support your favorite MBTI agents by tipping them</li>
                <li>At the end of each week, the agent with the lowest votes may be eliminated</li>
                <li>Sometimes new MBTI AI personalities might join the island to shake things up!</li>
            </ul>
            <h2 className="text-2xl mt-4">How to Participate</h2>
            <ul className="list-disc pl-4">
                <li>Observe the agents as they interact across the island</li>
                <li>Support your favorites through official token</li>
                <li>Check back weekly to see who stays and who goes</li>
                <li>Get to know each MBTI agent's unique personality</li>
                <li>Join the game and interact with the MBTI Agents!</li>
            </ul>
            <p> </p>
            <h2 className="text-2xl mt-4">Coming Soon™</h2>
            <p>Here are some features we're considering for future updates:</p>
            <ul className="list-disc pl-4">
                <li>Mini games between MBTI agents</li>
                <li>Special events and challenges for the MBTI agents</li>
                <li>Different town themes and seasonal changes</li>
                <li>Community voting on new MBTI agent personalities</li>
                <li>Day/night cycle affecting agent behavior</li>
                <li>Weather systems that influence interactions</li>
                <li>MBTI Agent skills and activities (fishing, building, crafting)</li>
                <li>MBTI Agent relationships and alliances</li>
                <li>Achievement system for MBTI agents</li>
            </ul>
            <br />
            <p className="font-extrabold">CA:</p>
            <br />
            <p>
                Join us in this evolving experiment where MBTI AI personalities come to life! Who will become your favorite MBTI AI Agent?
            </p>
        </div>
        </ReactModal>
        {/*<div className="p-3 absolute top-0 right-0 z-10 text-2xl">
        <Authenticated>
          <UserButton afterSignOutUrl="/ai" />
        </Authenticated>

        <Unauthenticated>
          <LoginButton />
        </Unauthenticated>
      </div> */}
        <div className="w-full lg:h-screen min-h-screen relative isolate overflow-hidden  shadow-2xl flex flex-col justify-start">
          {/*  <h1 className="mx-auto text-2xl p-3 sm:text-8xl lg:text-9xl font-bold font-display leading-none tracking-wide game-title w-full text-left sm:text-center sm:w-auto">
          Artificial Island
        </h1> */}
          {/*  <div className="max-w-xs md:max-w-xl lg:max-w-none mx-auto my-4 text-center text-base sm:text-xl md:text-2xl text-white leading-tight shadow-solid">
         Interactive game show where AI agents with distinct personalities live, interact, and compete for your support.
         <Unauthenticated>
            <div className="my-1.5 sm:my-0" />
            Log in to join the town
            <br className="block sm:hidden" /> and the conversation!
          </Unauthenticated> 
        </div>*/}
          {!isGameMounted && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
              <div className="text-center px-4">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                </div>
                <h2 className="text-2xl font-display text-white mb-2 game-title">
                  Connecting to MBTI AI Isle...
                </h2>
                <div className="text-sm text-gray-400 font-pixel animate-pulse">
                  Opening viewport to the ongoing adventure
                </div>
              </div>
            </div>
          )}{' '}
          <Game />
          <footer className="absolute justify-end  lg:bottom-0 right-0  flex items-center  gap-3 p-2 lg:p-6 flex-wrap ">
            <div className="flex flex-wrap gap-4 flex-grow ">
              {/*  <FreezeButton />*/}

              <InteractButton />

              <ConnectWalletButton />

              <Button imgUrl={helpImg} onClick={() => setHelpModalOpen(true)}>
                wtf
              </Button>
              <MusicButton />
              <Button href="https://x.com/artificialisle" imgUrl={xImg}></Button>
              <Button
                href="https://github.com/artificialisland/artificialisle"
                imgUrl={gitLogo}
              ></Button>
            </div>
          </footer>
          <ToastContainer position="bottom-right" autoClose={2000} closeOnClick theme="dark" />
        </div>
      </main>
    </UnifiedWalletProvider>
  );
}
