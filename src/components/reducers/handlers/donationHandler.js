import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadDonateToPrize, loadLottery, loadTztk, loadProvider, loadNetwork } from '../interactions';

const DonationHandler = () => {
  const [isDonating, setIsDonating] = useState(false);
  const [amountForDonate, setAmount] = useState(0);

  const dispatch = useDispatch();
  const provider = useSelector(state => state.provider.connection);
  const chainId = useSelector(state => state.provider.network);
  const lottery = useSelector(state => state.lottery.lotteryContract);
  const tztk = useSelector(state => state.tztk.tztkContract);

  useEffect(() => {
    if (!provider) {
      loadProvider(dispatch);
    }
    if (provider && !chainId) {
      loadNetwork(dispatch, provider);
    }
    if (provider && chainId && !lottery) {
      loadLottery(provider, chainId, dispatch);
    }
    if (provider && chainId && !tztk) {
      loadTztk(provider, chainId, dispatch);
    }
  }, [provider, chainId, lottery, tztk, dispatch]);

  const donateHandler = async (e) => {
    e.preventDefault();

    if (!tztk || !lottery) {
      console.error('Contracts are not loaded yet');
      return;
    }

    try {
      setIsDonating(true);
      const amount = amountForDonate;

      // Call the async function to donate
      await loadDonateToPrize(provider, chainId, lottery, tztk, amount, dispatch);
      window.alert('Donation successful!');
    } catch (error) {
      console.error('Error donating:', error);
      window.alert('Donation rejected or insufficient funds, try again...');
    } finally {
      setIsDonating(false);
    }
  };

  return (
    <>
      <div className="prize-pool">
        <h3 className="prize-pool-label">Donate to the <strong>PrizePool</strong> here!</h3>
      </div>
      <div className="donation-form">
        <input
          type="number"
          value={amountForDonate}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <button onClick={donateHandler} disabled={isDonating || !lottery || !tztk}>
          {isDonating ? 'Donating...' : 'Donate'}
        </button>
      </div>
      <br />
      <p>
        The above is to donate some of your TZTK tokens for the prizePool.<br />
        Thank you for <strong>donating!</strong>
      </p>
    </>
  );
};

export default DonationHandler;
