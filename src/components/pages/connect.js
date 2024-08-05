import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { loadAccount, loadNetwork, loadProvider,
  loadToken, loadLottery, loadLotteryPrize, loadNameAndSymbol,
  loadTriggerAmount, loadEntryPrice, loadCurrentPrizeWinner,
  loadCheckClaimedPrize, loadTokenBalance, loadCurrentWinAmount, loadTotalWinnings } from '../reducers/interactions';
import { Button } from 'react-bootstrap';
import Blockies from 'react-blockies';


const Connect = () => {
  // Fetching account from useSelector
const account = useSelector((state) => state.provider.account);
  // Dispatch
const dispatch = useDispatch();


  // useState for loading account and balance
const [balance, setBalance] = useState(0);
const [tokenBalance, setTokenBalance] = useState(0);
const [isLoading, setIsLoading] = useState(true);
const [amount, setAmount] = useState(0);
let provider, chainId

  const loadBlockchain = async () => {
      // Load provider
    provider = await loadProvider(dispatch);
    chainId = await loadNetwork(dispatch, provider)
      // Load account
      const account = await loadAccount(dispatch);
      // Load account balance in ether
      const token = await loadToken(provider, chainId, dispatch);
      const TBalance = await loadTokenBalance(provider, account, chainId, dispatch, token)
      setTokenBalance(TBalance);
      let balance = await provider.getBalance(account);
      balance = ethers.formatEther(balance);
      setBalance(balance.slice(0, 7));
      const lottery = await loadLottery(provider, chainId, dispatch);
        await loadCurrentPrizeWinner(provider, chainId, dispatch, lottery);
        await loadCheckClaimedPrize(provider, chainId, dispatch, lottery)
      await loadLotteryPrize(provider, chainId, dispatch, lottery)
      await loadCurrentWinAmount(provider, chainId, dispatch, lottery)
      await loadTotalWinnings(provider, chainId, dispatch, lottery)
      await loadTriggerAmount(provider, chainId, dispatch, lottery)
      await loadNameAndSymbol(provider, chainId, dispatch, token)

      const entryPrice = await loadEntryPrice(provider, chainId, dispatch, lottery);

      window.ethereum.on('accountsChanged', async () => {
        loadBlockchain();
      })
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
          <p>{tokenBalance} TZTK</p>
        </div>
        </>
      ) : (
      <Button className="btn-warning btn-lg" onClick={loadBlockchain}>Connect Wallet</Button>
      )}
    </>
  );
};

export default Connect;
