import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "./images/BLOT (1).svg";
import { Button } from "react-bootstrap";
import "./App.css";
import { ethers } from "ethers";
import Connect from "./components/pages/connect";
//import { loadLotteryPrize } from './components/reducers/interactions';
// need to import loadLottery and LoadBlot

function App() {
  const [participants, setParticipants] = useState(0);
  const [entries, setEntries] = useState(0);
  const [loadingBuyEntry, setLoadingBuyEntry] = useState(false);
  // loading prize balance using useSelector
  const prizeBalance = useSelector((state) => state.lottery.lotteryPrize);

  const donateHandler = () => {
    console.log("hello");
  };

  const handleEnter = () => {
    console.log(entries);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="connectArea">
          <Connect></Connect>
        </div>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Lottery App</h1>
      </header>
      <main className="main">
        <section className="lottery-info">
          {prizeBalance ? (
            <>
              <h2>Current Jackpot: {prizeBalance} BLOT</h2>
              <Button onClick={donateHandler}>Donate to Prize Here</Button>
              <hr></hr>
              <section className="entry-form">
                <h2>Enter the Lottery</h2>
                <input
                  type="number"
                  value={entries}
                  onChange={(e) => setEntries(e.target.value)}
                  placeholder="Number of Entries"
                />
                <button onClick={handleEnter}>Enter</button>
              </section>
              <p>
                Next draw in: <span className="countdown-timer">24:00:00</span>
              </p>
            </>
          ) : (
            <>
              <h2>Please Connect to Blockchain to See Prize</h2>
              <hr></hr>
            </>
          )}
        </section>
        <section className="recent-winners">
          <h2>Total Winnings Recieved!</h2>
          <h1>$$$$$$$</h1>
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
        <>
          <footer>
            <div className="advertisements">
              -- Insert advertisement code or images here --
              <p>Advertisement:</p>
              <p>image here</p>
              <div className="footer-content">
                <p>
                  &copy; <span id="current-year"></span> Your Company Name. All
                  rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </>
      </main>
    </div>
  );
}

export default App;
