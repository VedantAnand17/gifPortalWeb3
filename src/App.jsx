import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { Button } from "@/components/ui/button"

const TWITTER_HANDLE = 'vedantsx';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);

  const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
      const response = await window.solana.connect({ onlyIfTrusted: true });

      console.log(
        'Connected with Public Key:',
        response.publicKey.toString()
      );

      setWalletAddress(response.publicKey.toString());
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <Button onClick={connectWallet}>Connect to Wallet</Button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="w-screen h-screen bg-zinc-800 font-sans">
      <div className="flex flex-col items-center justify-around h-screen text-white">
        <div className="flex flex-col items-center">
          <p className="text-7xl pb-10">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          <div className='mt-5'>
            {walletAddress && renderNotConnectedContainer()}
          </div>
        </div>
        <div className="flex">
          <img alt="Twitter Logo" className="h-6 -mt-1 twitter-logo" src={twitterLogo} />
          <span>built on </span>
          <a
            className="font-bold"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;