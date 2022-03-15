import { BigNumber } from 'bignumber.js';
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
const wei_per_eth = new BigNumber(10).pow(18);
function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  
  const getCommunityWalletDetails = () => {
    return [{
      wallet: "0xB7f34dcD629989B529aBb39d2ad7a9CFc1B653D5",
      goal: 2 * wei_per_eth
    }];
  }

  useEffect(() => {
    let walletInfo = getCommunityWalletDetails();
    console.log({walletInfo});
    if (1===2) {
      setCurrentAccount("foo");
    }
  }, []);

  return (
    <div className="App">
      <header className="nav">
        <span>Community Wallet App</span>      
      </header>

      <h1>Welcome to the Community Wallet Site!</h1>

      {currentAccount ? <div>{currentAccount}</div> : <div>not connected!</div> }

    </div>
  );
}

export default App;
