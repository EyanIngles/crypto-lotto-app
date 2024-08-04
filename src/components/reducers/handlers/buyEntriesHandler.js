import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { loadBuyEntries } from '../interactions';

const BuyEntries = () => {
    const [entries, setEntries] = useState(0);
    const [isBuyingEntries, setIsBuyingEntries] = useState(false);

    const dispatch = useDispatch();
    const prizeBalance = useSelector((state) => state.lottery.lotteryPrize);
    const provider = useSelector(state => state.provider.connection);
    const chainId = useSelector(state => state.provider.network);
    const token = useSelector((state) => state.token);
    const lottery = useSelector((state) => state.lottery);

    const handleEnter = async (e) => {
        e.preventDefault();
        setIsBuyingEntries(true);

        try {
            await loadBuyEntries(provider, chainId, token, entries, lottery, dispatch);
        } catch (error) {
            console.error("Error buying entries:", error);
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
                    onChange={(e) => setEntries(parseInt(e.target.value))}
                    placeholder="Number of Entries"
                />
                <button className="btn-enter" onClick={handleEnter} disabled={isBuyingEntries}>
                    {isBuyingEntries ? 'Processing...' : 'Enter'}
                </button>
            </section>
            <div className="info-container">
                <p className="info-text">
                    Draws are triggered once the triggerAmount has been exceeded. This ensures that the draw can be triggered more frequently, giving participants a chance at a prize.
                </p>
            </div>
            <hr />
        </>
    );
};

export default BuyEntries;
