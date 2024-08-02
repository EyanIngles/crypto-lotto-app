import { useState } from "react";
import { useSelector } from "react-redux";
import logo from "./images/BLOT (1).svg";
import { Button } from "react-bootstrap";
import  DonationHandler  from './components/reducers/handlers/donationHandler';
import BuytEntries from "./components/reducers/handlers/buyEntriesHandler";
import "./App.css";
import Connect from "./components/pages/connect";

function App() {
  const prizeBalance = useSelector((state) => state.lottery.lotteryPrize);

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
           
           </>
          ) : (
            <h2>Please Connect to Blockchain to See Prize</h2>
          )}
        </section>
        <section className="recent-winners">
          <h2>Total Winnings Received!</h2>
          <h1>**event listener**</h1>
        </section>
        <section className="faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3><strong>How do I enter to receive the prize?</strong></h3>
            <p>
              We require a small amount of tokens to enter the prize. The cost
              is 100 tokens per ticket. Simply enter the amount of tickets you
              want to purchase and press the 'ENTER' button.
            </p>
          </div>
          <div className="faq-item">
            <h3><strong>How do I get the tokens required?</strong></h3>
            <p>
              The most secure way is to purchase the tokens from Uniswap v3. You
              will need Ethereum to do this. Simply make sure that the smart
              contract address is: <code>0x0</code>.
            </p>
          </div>
        </section>
        <footer>
          <div className="advertisements">
            <p>Advertisement:</p>
            <p>image here</p>
            <div className="footer-content">
              <p>
                 <span id="current-year"></span> TreasureDraw. All
                rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
