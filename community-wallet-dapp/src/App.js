import { BigNumber } from 'bignumber.js';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import './App.css';

function App() {
  const wei_per_eth = new BigNumber(10).pow(18);
  const completeWalletABI = [
    {
      constant: false,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'removeOwner',
      outputs: [],
      type: 'function'
    },
    {
      constant: false,
      inputs: [{ name: '_addr', type: 'address' }],
      name: 'isOwner',
      outputs: [{ name: '', type: 'bool' }],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'm_numOwners',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'm_lastDay',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'version',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'resetSpentToday',
      outputs: [],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'm_spentToday',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function'
    },
    {
      constant: false,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'addOwner',
      outputs: [],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'm_required',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function'
    },
    {
      constant: false,
      inputs: [{ name: '_h', type: 'bytes32' }],
      name: 'confirm',
      outputs: [{ name: '', type: 'bool' }],
      type: 'function'
    },
    {
      constant: false,
      inputs: [{ name: '_newLimit', type: 'uint256' }],
      name: 'setDailyLimit',
      outputs: [],
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        { name: '_to', type: 'address' },
        { name: '_value', type: 'uint256' },
        { name: '_data', type: 'bytes' }
      ],
      name: 'execute',
      outputs: [{ name: '_r', type: 'bytes32' }],
      type: 'function'
    },
    {
      constant: false,
      inputs: [{ name: '_operation', type: 'bytes32' }],
      name: 'revoke',
      outputs: [],
      type: 'function'
    },
    {
      constant: false,
      inputs: [{ name: '_newRequired', type: 'uint256' }],
      name: 'changeRequirement',
      outputs: [],
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        { name: '_operation', type: 'bytes32' },
        { name: '_owner', type: 'address' }
      ],
      name: 'hasConfirmed',
      outputs: [{ name: '', type: 'bool' }],
      type: 'function'
    },
    {
      constant: false,
      inputs: [{ name: '_to', type: 'address' }],
      name: 'kill',
      outputs: [],
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        { name: '_from', type: 'address' },
        { name: '_to', type: 'address' }
      ],
      name: 'changeOwner',
      outputs: [],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'm_dailyLimit',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function'
    },
    {
      inputs: [
        { name: '_owners', type: 'address[]' },
        { name: '_required', type: 'uint256' },
        { name: '_daylimit', type: 'uint256' }
      ],
      type: 'constructor'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'owner', type: 'address' },
        { indexed: false, name: 'operation', type: 'bytes32' }
      ],
      name: 'Confirmation',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'owner', type: 'address' },
        { indexed: false, name: 'operation', type: 'bytes32' }
      ],
      name: 'Revoke',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'oldOwner', type: 'address' },
        { indexed: false, name: 'newOwner', type: 'address' }
      ],
      name: 'OwnerChanged',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'newOwner', type: 'address' }],
      name: 'OwnerAdded',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'oldOwner', type: 'address' }],
      name: 'OwnerRemoved',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'newRequirement', type: 'uint256' }],
      name: 'RequirementChanged',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'from', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' }
      ],
      name: 'Deposit',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'owner', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
        { indexed: false, name: 'to', type: 'address' },
        { indexed: false, name: 'data', type: 'bytes' }
      ],
      name: 'SingleTransact',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'owner', type: 'address' },
        { indexed: false, name: 'operation', type: 'bytes32' },
        { indexed: false, name: 'value', type: 'uint256' },
        { indexed: false, name: 'to', type: 'address' },
        { indexed: false, name: 'data', type: 'bytes' }
      ],
      name: 'MultiTransact',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'operation', type: 'bytes32' },
        { indexed: false, name: 'initiator', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
        { indexed: false, name: 'to', type: 'address' },
        { indexed: false, name: 'data', type: 'bytes' }
      ],
      name: 'ConfirmationNeeded',
      type: 'event'
    }
  ];
  const minCoinABI = [
    {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},
    {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"}
  ];

  const [currentAccount, setCurrentAccount] = useState(null);
  const [connectErrorMessage, setConnectErrorMessage] = useState(null);
  const [commWalletTotal, setCommWalletTotal] = useState(0.000000001);
  // this is where you set your community wallet and your goal in Ethereum. 
  // this is setup as an array, but the UI presently only supports the first item in the list.
  const old_mbc_community_wallet = "0xB7f34dcD629989B529aBb39d2ad7a9CFc1B653D5";
  const mrow_class_act_wallet =  "0x8F995cF52053afEB1d24C5526c288DDECCd4757e";
  const bellmorecode_eth_wallet = "0xf7f57c43fc717a90541673500762915dd2260965";
  const getCommunityWalletDetails = () => {
    return [{
      wallet: mrow_class_act_wallet,
      goal: 1.5
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
  //console.log({comm_wallet});
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
  let progress_percent = (commWalletTotal / comm_wallet.goal * 100).toFixed(2);
  useEffect(() => {
    const loadCommWalletTotals = () => {
      if (window.ethereum) {
        let eth = window.ethereum;
        let provider = new ethers.providers.Web3Provider(eth);
        let wallet_contract = new ethers.Contract(mrow_class_act_wallet, completeWalletABI, provider);
        provider.getBalance(comm_wallet.wallet).then(output => {
          let f = output;
          let wallet_balance = output / wei_per_eth;
          setCommWalletTotal(wallet_balance);
        });

        provider.getBlock(14368002).then(res => {
          console.log({res});
        })
        
        
        
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
      <h1>MBC Class Action</h1>
      <p className='lead'>
        We are collecting funds from MBC holders for a class action lawsuit against the MBC Founds.
      </p>
      <p className='lead' >
        The funds collected through this site in the wallet listed below will be used for legal fees.
      </p>
      
      <h3>Our Goal</h3>
      
      <div className="progress-label col-8 offset-2 mb-2">
        {commWalletTotal.toFixed(8)} / {comm_wallet.goal} ETH
        
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

      <div className='mt-4 hidden' >
          {currentAccount ? `connected with ${currentAccount}`: `wallet not connected`}
      </div>

      <div>
        <h6>Our Patrons</h6>

        <ul className='patrons-list'>

        </ul>
      </div>

      <div className='mt-4'>
          <small>open source: <a href='https://github.com/bellmorecode/CommunityWalletDapp' title='Link to Source Code (github)' rel="noreferrer" target='_blank'>bellmorecode/CommunityWalletDapp</a></small>
      </div>
    </div>
  );
}
export default App;