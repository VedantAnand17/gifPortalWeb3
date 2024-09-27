import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const TWITTER_HANDLE = 'vedantsx';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const TEST_GIFS = [
    'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
    'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
    'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
    'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
  ]

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

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

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
      try {
        // Fetching GIF to avoid CORS issues
        await fetch(inputValue, { mode: 'no-cors' })
          .then((response) => {
            if (response.ok || response.type === 'opaque') {
              // If the response is ok or opaque (no-cors), we add it to the list
              setGifList([...gifList, inputValue]);
              setInputValue('');
            } else {
              console.log('GIF URL might be invalid or blocked by CORS.');
            }
          })
          .catch((err) => {
            console.log('Error fetching the GIF:', err);
          });
      } catch (error) {
        console.log('Error processing the GIF link:', error);
      }
    } else {
      console.log('Empty input. Try again.');
    }
  };

  const renderConnectedContainer = () => (
    <div className="mx-auto px-4">
      <form className='flex flex-col items-center '
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <Input className='text-black max-w-sm' 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter gif link!" />
        <div className="py-2">
          <Button type="submit" className="">Submit</Button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {gifList.map((gif) => (
          <div className="p-2" key={gif}>
            <img className="rounded-xl w-full h-auto max-h-60 object-cover" src={gif} alt="gif" />
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
  
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      setGifList(TEST_GIFS); 
    }
  }, [walletAddress]);

  return (
    <div className="w-screen h-full min-h-screen bg-zinc-800 font-sans">
      <div className="flex flex-col items-center justify-around text-white min-h-screen">
        <div className="flex flex-col items-center">
          <p className="text-7xl pb-10 p-5">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          <div className='mt-5'>
            {!walletAddress && renderNotConnectedContainer()}
            {walletAddress && renderConnectedContainer()}
          </div>
        </div>
        <div className="flex p-5">
          <img alt="Twitter Logo" className="h-6 -mt-1 twitter-logo" src={twitterLogo} />
          <span>built by </span>
          <a
            className="font-bold ml-1"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{` @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;