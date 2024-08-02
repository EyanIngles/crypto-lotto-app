import { useEffect, useState, React, } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { loadBuyEntries, loadProvider, loadNetwork, loadTztk, loadLottery } from '../interactions';

const BuytEntries = () => {
    const [entries, setEntries] = useState(0);
    const [isBuyingEntries, setIsBuyingEntries] = useState(false);

    const dispatch = useDispatch();
    const provider = useSelector(state => state.provider.connection);
    const chainId = useSelector(state => state.provider.network);
    const prizeBalance = useSelector((state) => state.lottery.lotteryPrize);


  const handleEnter = async (e) => {
    const provider = await loadProvider(dispatch);
    const chainId = await loadNetwork(dispatch, provider)
      const tztk = await loadTztk(provider, chainId, dispatch);
      const lottery = await loadLottery(provider, chainId, dispatch);
    e.preventDefault();

    if (!prizeBalance) {
      console.error('Contracts are not loaded yet');
      return;
    }

    try {
    setIsBuyingEntries(true);
      const entriesIN = entries;

      // Call the async function to donate
      await loadBuyEntries(provider, chainId, entriesIN, tztk, lottery, dispatch);
      window.alert(entriesIN);
    } catch (error) {
      console.error('Error donating:', error);
      window.alert('Donation rejected or insufficient funds, try again...');
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
              <p>donate handler here</p>
    </>
  );
};

export default BuytEntries;
