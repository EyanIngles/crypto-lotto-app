import { useEffect, useState, React, } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { loadBuyEntries, loadProvider, loadNetwork, loadTztk, loadLottery } from '../interactions';

const BuytEntries = () => {
    const [entries, setEntries] = useState(0);
    const [isBuyingEntries, setIsBuyingEntries] = useState(false);
    const [amount, setAmount] = useState(0);

    const dispatch = useDispatch();


    const prizeBalance = useSelector((state) => state.lottery.lotteryPrize);


  const handleEnter = async (e) => {
    const provider = await loadProvider(dispatch);
    const chainId = await loadNetwork(dispatch, provider)
    e.preventDefault();

    if (entries < 0) {
      throw new Error('Contracts are not properly initialized');
  }

    try {
      if(entries > 0) {
        setAmount(entries)
        loadBuyEntries(provider, chainId, amount, dispatch);
        setAmount(0);
      }

    } catch (error) {
      console.error('Error entering lottory:', error);
      window.alert('Entry rejected or insufficient funds, try again...');
    } finally {
        setIsBuyingEntries(false);
    }
  };

  return (
    <>
         <div className="prize-pool">
                <h3 className="prize-pool-label">Draw Prize:</h3>
                <h2 className="prize-pool-amount">TreasureToken</h2>
                <h2 className="prize-pool-amount">{prizeBalance} (TZTK)</h2>
              </div>
              <section className="entry-form">
                <h2>Enter the Draw</h2>
                <input
                  type="number"
                  value={entries}
                  onChange={(e) => setEntries(e.target.value)}
                  placeholder="Number of Entries"
                />
                <button className="btn-enter" onClick={handleEnter}>Enter</button>
              </section>
              <div className="info-container">
                <p className="info-text">Draws are triggered once the triggerAmount has been exceeded. This ensures that the draw can be triggered more frequently, giving participants a chance at a prize.</p>
              </div><hr></hr>
    </>
  );
};

export default BuytEntries;
