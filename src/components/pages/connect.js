import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { loadAccount, loadNetwork, loadProvider, loadBLOT, loadLottery, loadLotteryPrize } from '../reducers/interactions';
import { Button } from 'react-bootstrap';
import Blockies from 'react-blockies';


const Connect = () => {
  // Fetching account from useSelector
const account = useSelector((state) => state.provider.account);

  // Dispatch
const dispatch = useDispatch();


  // useState for loading account and balance
const [balance, setBalance] = useState(0);
const [blotBalance, setBlotBalance] = useState(0);
const [isLoading, setIsLoading] = useState(true);

  const loadBlockchain = async () => {
    try {
      // Load provider
    const provider = await loadProvider(dispatch);
    const chainId = await loadNetwork(dispatch, provider)

      // Load network and dispatch the data
      await loadNetwork(dispatch, provider);
      // Load account
      const account = await loadAccount(dispatch);
      const Blot = await loadBLOT(provider, chainId, dispatch);
      const lottery = await loadLottery(provider, chainId, dispatch);
      await loadLotteryPrize(provider, chainId, dispatch, lottery)
      // Load account balance in ether
      let balance = await provider.getBalance(account);
      balance = ethers.formatEther(balance);
      setBalance(balance.slice(0, 7));

      let blotBalance = await Blot.balanceOf(account);
      blotBalance = ethers.formatEther(blotBalance);
      setBlotBalance(blotBalance.slice(0, 10));
    } catch (error) {
      window.alert('MetaMask error, Please try again');
    }
    setIsLoading(false);
  };

  // useEffect to load blockchain and access blockchain data
  useEffect(() => {
    if (isLoading && account) {
      loadBlockchain();
    }
  }, [isLoading, account]);

  return (
    <>
      {account? (
        <>
        <div className='account-info'>
        <Blockies
          className='blockie'
          seed={account}/>
          <p>{account.slice(0,6)}...{account.slice(36,42)}</p>
          <p>{balance} ETH</p>
          <p>{blotBalance} BLOT</p>
        </div>
        </>
      ) : (
      <Button className="btn-success btn-lg" onClick={loadBlockchain}>Connect Wallet</Button>
      )}
    </>
  );
};

export default Connect;
