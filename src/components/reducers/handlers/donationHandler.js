import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadDonateToPrize, loadToken, loadLottery } from '../interactions';

const DonationHandler = () => {
  const [isDonating, setIsDonating] = useState(false);
  const [amountForDonate, setAmount] = useState(0);

  const dispatch = useDispatch();
  const prizeBalance = useSelector((state) => state.lottery.lotteryPrize);
  const provider = useSelector((state) => state.provider.connection);
  const chainId = useSelector((state) => state.provider.network);
  const token = useSelector((state) => state.token);
  const lottery = useSelector((state) => state.lottery);



  const donateHandler = async (e) => {
    e.preventDefault();

    try {
      setIsDonating(true);
      const amount = amountForDonate;
      // Call the async function to donate
      await loadDonateToPrize(provider, amount, lottery, token, chainId, dispatch);
    } catch (error) {
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
        <button onClick={donateHandler} disabled={isDonating}>
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
