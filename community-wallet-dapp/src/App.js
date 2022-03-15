import { BigNumber } from 'bignumber.js';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const wei_per_eth = new BigNumber(10).pow(18);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [connectErrorMessage, setConnectErrorMessage] = useState(null);
  const [commWalletTotal, setCommWalletTotal] = useState(0.1092359);
  // this is where you set your community wallet and your goal in Ethereum. 
  // this is setup as an array, but the UI presently only supports the first item in the list.
  const getCommunityWalletDetails = () => {
    return [{
      wallet: "0xB7f34dcD629989B529aBb39d2ad7a9CFc1B653D5",
      goal: 0.25
    }];
  }
  const connectWalletHandler = () => {
      if (window.ethereum) {
        let eth = window.ethereum;
        eth.request({ method: 'eth_requestAccounts' })
            .then(wallets => {
              if (wallets.length !== 0) {
                setCurrentAccount(wallets[0]);
                
              }
            })
            .catch(err => { setConnectErrorMessage(err.message); });
      }
  }
  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='connect-wallet-button'>
        Connect your wallet
      </button>
    )
  }
  const donateAmountChangedHandler = () => {
      console.log({changed: 1});
  }
  const handleDonateButton = () => {
    let comm_wallet = getCommunityWalletDetails()[0];
    let amt = document.getElementById('donateAmount').value;
    try {
      if (window.ethereum) {
        let eth = window.ethereum;
        const payment_provider = new ethers.providers.Web3Provider(eth);
        const signer = payment_provider.getSigner();
        const tx = signer.sendTransaction({
          to: comm_wallet.wallet,
          value: ethers.utils.parseEther(amt)
        });
        tx.then(x => console.log({ txResult: x })).catch(err => { console.log({err}); setConnectErrorMessage(err.message) });
      }
    } catch (err) {
      setConnectErrorMessage(err.message);
    } 
  }
  let comm_wallet = getCommunityWalletDetails()[0];
  const donateForm = () => {
    return (
      <div className='donateForm form-group form-inline col-6 bg-light offset-3 py-4 my-2'>
            <label className='col-label mx-4'>Donation Amount</label>
            <input type='number' onChange={donateAmountChangedHandler} placeholder='0.01' step='0.01' className='donateAmount form-control-sm' id='donateAmount'/>
            <label className='col-label mx-4 eth-label'>ETH</label>
            <button onClick={handleDonateButton} className='donateButton'>DONATE</button>
      </div>
    );
  }
  const clearErrorMessageHandler = () => {
    setConnectErrorMessage(null);
  }
  let progress_percent = commWalletTotal / comm_wallet.goal * 100;
  
  useEffect(() => {
    const loadCommWalletTotals = () => {
      if (window.ethereum) {
        let eth = window.ethereum;
        console.log(`connection to wallet: ${comm_wallet.wallet}`);
        let provider = new ethers.providers.Web3Provider(eth);
        provider.getBalance(comm_wallet.wallet).then(output => {
          let wallet_balance = output.toNumber()  / wei_per_eth;
          console.log({balance: wallet_balance});
          setCommWalletTotal(wallet_balance);
        });
        
      }
  };
  loadCommWalletTotals();    
  }, [])

  useEffect(() => {
    const checkWalletAccess = () => {
      if (window.ethereum) {
        let eth = window.ethereum;
        eth.request({method: 'eth_accounts'}).then(wallets => {
            if (wallets.length > 0) {
              setCurrentAccount(wallets[0]);
            }
        }).catch(err => setConnectErrorMessage(err.message));
      }
    };
    checkWalletAccess();    
  }, []);
  
  return (
    <div className="App">
      <h1>Community Wallet Site!</h1>
      <p className='lead'>
        Hi. This is a Community Wallet Donation demo app.
      </p>
      <p className='lead' >
        This is where you can describe your cause or plan. Pitch your community!
      </p>
      
      <h3>Our Goal</h3>
      
      <div className="progress-label col-8 offset-2 mb-2">
        {commWalletTotal} / {comm_wallet.goal} ETH
        
        <span className='px-1'>({progress_percent}%)</span>
      </div>

      <div className="progress col-6 offset-3" title={`${progress_percent}%`}>
        <div className="progress-bar bg-success" role="progressbar" style={{width:progress_percent + '%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" id="progressBar1"></div>
      </div>

      <div className='mt-2 mb-4'>
        Our Wallet: <a href={`https://etherscan.io/address/${comm_wallet.wallet}`} rel="noreferrer" target='_blank' title='View Wallet on Etherscan'> {comm_wallet.wallet} </a>
      </div>
      
      {currentAccount ? donateForm() : connectWalletButton() }
      <div className='notice' onClick={clearErrorMessageHandler} title={connectErrorMessage}>{connectErrorMessage}</div>

      <div className='mt-4'>
          <small>open source: <a href='https://github.com/bellmorecode/CommunityWalletDapp' title='Link to Source Code (github)' rel="noreferrer" target='_blank'>bellmorecode/CommunityWalletDapp</a></small>
      </div>
    </div>
  );
}
export default App;