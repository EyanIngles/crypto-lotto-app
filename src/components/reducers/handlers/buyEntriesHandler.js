import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { loadBuyEntries, loadClaimReward } from '../interactions';
import { ethers } from 'ethers';

const BuyEntries = () => {
    const [entries, setEntries] = useState(0);
    const [isBuyingEntries, setIsBuyingEntries] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false)

    const dispatch = useDispatch();
    const prizeBalance = useSelector((state) => state.lottery.lotteryPrize);
    const triggerAmount = useSelector((state) => state.lottery.triggerAmount);
    const provider = useSelector(state => state.provider.connection);
    const chainId = useSelector(state => state.provider.network);
    const token = useSelector((state) => state.token);
    const lottery = useSelector((state) => state.lottery);
    const winnerOfPrize = useSelector((state) => state.lottery.currentPrizeWinner);
    const winnerHasClaimedPrize = useSelector((state) => state.lottery.prizeBeenClaimed)
    const account = useSelector((state) => state.provider.account);
    let currentPrizeBalance = 0;
    const winnerSlicedAddress = (winnerOfPrize.slice(0,6)) + "..." + (winnerOfPrize.slice(36,42))
    const winAmount = useSelector((state) => state.lottery.currentWinAmount)

    if(winnerOfPrize) {
    try{
        currentPrizeBalance = (prizeBalance) // need to minute the winning amount
    } catch {
        console.log("You are not the winner or winner has not yet be anounced")
    }
    }

    const handleEnter = async (e) => {
        e.preventDefault();
        setIsBuyingEntries(true);

        try {
            await loadBuyEntries(provider, chainId, token, entries, lottery, dispatch);
        } catch (error) {
            console.error("Error buying entries:", error);
            setIsBuyingEntries(false);
        } finally {
            setIsBuyingEntries(false);
        }
    };

    const handleClaim = async () => {
        setIsClaiming(true);

        try {
            await loadClaimReward(provider, lottery, token, chainId, dispatch)
        } catch (error) {
            console.error("Error claiming rewards:", error);
            setIsClaiming(false);

        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <>
        {winnerSlicedAddress === "0x0000...000000" || winnerHasClaimedPrize === true? (
            <><div className="prize-pool">
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
                Draws are triggered once the triggerAmount has been exceeded.
                This ensures that the draw can be triggered more frequently,
                giving participants a chance at a prize.
            </p>
            <p>Once Draw Prize reaches: <br></br>
            <strong>{triggerAmount} (TZTK)</strong><br></br>
            The Prize Winner Will be Called</p>
        </div>
        <hr />
        </>
        ) : (
                <>
                <div className="prize-pool">
            <h1 className="prize-pool-amount"><strong>WINNER!</strong></h1>
            <h3 className="prize-pool-label">Address: {winnerSlicedAddress}<br></br>
            You Have Won: <strong>{winAmount}</strong> (TZTK)</h3>
            <button className="btn-enter" onClick={handleClaim} disabled={isClaiming}>
                    {isClaiming ? 'Claiming Prize...' : 'Click to Claim'}
                </button>
            </div>
            <div className="prize-pool">
                <h3 className="prize-pool-label">New Draw Prize:</h3>
                <h2 className="prize-pool-amount">TreasureToken</h2>
                <h2 className="prize-pool-amount">{currentPrizeBalance} (TZTK)</h2>
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
                    Draws are triggered once the triggerAmount has been exceeded.
                    This ensures that the draw can be triggered more frequently,
                    giving participants a chance at a prize.
                </p>
                <p>Once Draw Prize reaches: <br></br>
                <strong>{triggerAmount} (TZTK)</strong><br></br>
                The Prize Winner Will be Called</p>
            </div>
            <hr />
            </>
            )}
        </>
    );
};

export default BuyEntries;
