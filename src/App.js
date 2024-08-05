import { useState } from "react";
import { useSelector } from "react-redux";
import logo from "./images/BLOT (1).svg";
import { Button } from "react-bootstrap";
import DonationHandler from "./components/reducers/handlers/donationHandler";
import BuytEntries from "./components/reducers/handlers/buyEntriesHandler";
import "./App.css";
import Connect from "./components/pages/connect";

function App() {
  const prizeBalance = useSelector((state) => state.lottery.lotteryPrize);
  const totalWinnings = useSelector((state) => state.lottery.totalWinnings);
  const chainId = useSelector((state) => state.provider.chainId)
  console.log(chainId)


  return (
    <div className="App">
      <header className="App-header">
        <div className="connectArea">
          <Connect />
        </div>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Treasure Draw</h1>
      </header>
      <main className="main">
        <section className="lottery-info">
          {prizeBalance ? (
            <>
              <BuytEntries></BuytEntries>
              <DonationHandler></DonationHandler>
            </>
          ) : (
            <h2>Please Connect to Blockchain to See Prize</h2>
          )}
        </section>
        {totalWinnings ? (
          <section className="recent-winners">
            <h2>Total Winnings Received!</h2>
            <h1>
              <strong>{totalWinnings}</strong> (TZTK)
            </h1>
          </section>
        ) : (
          <section className="recent-winners">
            <h2>Learn how to participant!</h2>
            <p>
              <strong>1.</strong> Connect Your Wallet: Use your web browser or the MetaMask mobile
              app to connect your MetaMask wallet to this site.<br/>
              <strong>2.</strong> Enter the Draw: Enter the number of entries you wish to purchase and deposit the
              corresponding amount.<br/>
              <strong>3.</strong>Wait for the Draw: Once the trigger amount is reached, the draw will automatically take place.<br/>
              <strong>4.</strong>Check for Winners: If your address is displayed as the winner, you can proceed to claim your prize.<br/>
              <strong>5.</strong>Claim Your Prize: Click the "Claim Rewards" button to receive your prize.<br/>
            </p>
          </section>
        )}
        <br />
        <section className="faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>
              <strong>How do I enter to receive the prize?</strong>
            </h3>
            <p>
              We require a small amount of tokens to enter the prize. The cost
              is 100 tokens per ticket. Simply enter the amount of tickets you
              want to purchase and press the 'ENTER' button.
            </p>
          </div>
          <div className="faq-item">
            <h3>
              <strong>How do I get the tokens required?</strong>
            </h3>
            <p>
              The most secure way is to purchase the tokens from Uniswap v3. You
              will need Ethereum to do this. Simply make sure that the smart
              contract address is:</p>
              {chainId ? (
                <>{chainId ===  11155111 ?
                  (<code> Ethereum:</code>):
                  (<code> Sepolia:</code>)}
                  </>
              ) : (
                <>
                  <p><code>Load the blockchain to see address</code></p>
                </>
              )}
          </div>
        </section>
        <footer>
          <div className="advertisements">
            <p>Advertisement:</p>
            <p>image here</p>
            <div className="footer-content">
              <p>
                <span id="current-year"></span> TreasureDraw. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
