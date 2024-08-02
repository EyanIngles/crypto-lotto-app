import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { ethers } from 'ethers';
import { loadProvider, loadNetwork, loadTztk, loadLottery, loadBuyEntries } from '../interactions';

const BuyEntries = () => {
    const [entries, setEntries] = useState(0);
    const [isBuyingEntries, setIsBuyingEntries] = useState(false);
    const [amount, setAmount] = useState(0);
    const [lottery, setLottery] = useState(null);
    const [tztk, setTztk] = useState(null);
    const [provider, setProvider] = useState(null);
    const [chainId, setChainId] = useState(null);

    const dispatch = useDispatch();

    const providerState = useSelector(state => state.provider.connection);
    const chainIdState = useSelector(state => state.provider.network);
    const lotteryState = useSelector(state => state.lottery.lotteryContract);
    const prizeBalance = useSelector(state => state.lottery.lotteryPrize);

    useEffect(() => {
        if (providerState) setProvider(providerState);
        if (chainIdState) setChainId(chainIdState);
        if (lotteryState) setLottery(lotteryState);
    }, [providerState, chainIdState, lotteryState]);

    const handleEnter = async (e) => {
        e.preventDefault();

        if (!lottery || entries <= 0) {
            window.alert('Contracts are not properly initialized or invalid entries.');
            return;
        }

        try {
            setIsBuyingEntries(true);
            setAmount(entries);
            await loadBuyEntries(provider, chainId, lottery, dispatch);
            setEntries(0);
            setAmount(0);
        } catch (error) {
            console.error('Error entering lottery:', error);
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
