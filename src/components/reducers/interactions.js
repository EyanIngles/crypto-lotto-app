import { setAccount, setNetwork, setProvider, setTokenBalance } from "./provider";
import { setContractLottery, setLotteryPrize,
    setDonateToPrize, setEntries, setCheckPrice,
    setCheckPrizeWinner, setCheckTriggerAmount,
    setCheckClaimedPrize, setCurrentWinAmount, setTotalWinnings } from "./lotteryStore";
import { setContractToken, setName, setSymbol } from './tokenStore';
import { ethers } from "ethers";
import TOKEN_ABI from '../abis/TOKEN_ABI.json';
import LOTTERY_ABI from '../abis/LOTTERY_ABI.json';
import config from '../abis/config.json';


export const loadProvider = async (dispatch) => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        //const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/') //hardhat HTTP
        dispatch(setProvider(provider))

    return provider;
}

export const loadAccount = async (dispatch) => {
//connecting to meta mask with a try and catch to catch an error if metamask if not installed
if(typeof window.ethereum !== 'undefined') {
    try{
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        dispatch(setAccount(account));

        return account;
    } catch(err) {
        window.alert('Metamask unable to be located. Please install metamask and try again.')
        const deadAccount = ''
        dispatch(setAccount(deadAccount));
    }
}

}

export const loadNetwork = async (dispatch, provider) => {
    const chainId = (await provider.getNetwork()).chainId.toString()
    dispatch(setNetwork(chainId))

    return chainId
}

export const loadLottery = async (provider, chainId, dispatch) => {
    const lottery = new ethers.Contract(config[chainId].lottery.address, LOTTERY_ABI, provider)

    dispatch(setContractLottery(lottery))

    return lottery
}

export const loadToken = async (provider, chainId, dispatch) => {
    const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider)
    dispatch(setContractToken(token))

    return token
}
export const loadNameAndSymbol = async (provider, chainId, dispatch, token) => {
    token = await loadToken(provider, chainId, dispatch);
    const name = await token.name();
    const symbol = await token.symbol();

    dispatch(setName(name))
    dispatch(setSymbol(symbol))

    return name, symbol
}
export const loadTokenBalance = async (provider, account, chainId, dispatch, token) => {
    token = await loadToken(provider, chainId, dispatch);
    account = await loadAccount(dispatch);

    const TBalance = await token.balanceOf(account)
    const tokenBalance = ethers.formatEther(TBalance)

    dispatch(setTokenBalance(tokenBalance))
    return tokenBalance
}

export const loadLotteryPrize = async (provider, chainId, dispatch, lottery, token) => {
    lottery = await loadLottery(provider, chainId, dispatch);
    token = await loadToken(provider, chainId, dispatch);
    const lotteryPrizeBignumber = await token.balanceOf(lottery.getAddress());
    const lotteryPrize = ethers.formatEther(lotteryPrizeBignumber);
    dispatch(setLotteryPrize(lotteryPrize));

    return lotteryPrize
}
export const loadEntryPrice = async (provider, chainId, dispatch, lottery) => {
    lottery = await loadLottery(provider, chainId, dispatch);
    const entryPrice = (await lottery.priceOfEntry()).toString(); // Convert BigNumber to string
    dispatch(setCheckPrice(entryPrice));
    return entryPrice;
}

export const loadTriggerAmount = async (provider, chainId, dispatch, lottery) => {
    lottery = await loadLottery(provider, chainId, dispatch);
    const triggerAmount = (await lottery.triggerAmount()).toString(); // Convert BigNumber to string
    dispatch(setCheckTriggerAmount(triggerAmount));
    return triggerAmount;
}

export const loadCurrentPrizeWinner = async (provider, chainId, dispatch, lottery) => {
    lottery = await loadLottery(provider, chainId, dispatch);
    const winner = (await lottery.winner()).toString(); // Convert BigNumber to string
    dispatch(setCheckPrizeWinner(winner));
    return winner;
}
export const loadCheckClaimedPrize = async (provider, chainId, dispatch, lottery) => {
    lottery = await loadLottery(provider, chainId, dispatch);
    const winner = await lottery.winnerHasClaimed(); // Convert BigNumber to string
    dispatch(setCheckClaimedPrize(winner));
    return winner;
}
export const loadCurrentWinAmount = async (provider, chainId, dispatch, lottery) => {
    lottery = await loadLottery(provider, chainId, dispatch);
    const winAmountBigInt = await lottery.winAmount();
    const winAmount = ethers.formatEther(winAmountBigInt);

    dispatch(setCurrentWinAmount(winAmount));
    return winAmount;
}
export const loadTotalWinnings = async (provider, chainId, dispatch, lottery) => {
    lottery = await loadLottery(provider, chainId, dispatch);
    const totalWinningsBigINT = await lottery.totalWinningsClaimed();
    const totalWinnings = ethers.formatEther(totalWinningsBigINT);

    dispatch(setTotalWinnings(totalWinnings));
    return totalWinnings;
}

export const loadClaimReward = async (provider, lottery, token, chainId, dispatch) => {
    const signer = await provider.getSigner();
    chainId = await loadNetwork(dispatch, provider)
    lottery = await loadLottery(provider, chainId, dispatch);
    token = await loadToken(provider, chainId, dispatch);
    const account = await loadAccount(dispatch);

        const tx = await lottery.connect(signer).winnerCLaimPrize();
        const result = await tx.wait();

        await loadLotteryPrize(provider, chainId, dispatch, lottery)
        await loadAccount(dispatch);
        await loadCurrentPrizeWinner(provider, chainId, dispatch, lottery)
        await loadCheckClaimedPrize(provider, chainId, dispatch, lottery)
        await loadTotalWinnings(provider, chainId, dispatch, lottery)

        await loadTokenBalance(provider, account, chainId, dispatch, token)
        dispatch(setDonateToPrize(result));
  }

export const loadDonateToPrize = async (provider, amount, lottery, token, chainId, dispatch) => {
    const signer = await provider.getSigner();
    chainId = await loadNetwork(dispatch, provider)
    lottery = await loadLottery(provider, chainId, dispatch);
    token = await loadToken(provider, chainId, dispatch);

    const bigAmount = ethers.parseUnits(amount, 18).toString(); // Adjust the decimals as per your token

        const approveTx = await token.connect(signer).approve(lottery.getAddress(), bigAmount);
        await approveTx.wait();

        const tx = await lottery.connect(signer).donateToPrizeFund(bigAmount);
        const result = await tx.wait();

        const account = await loadAccount(dispatch);

        await loadLotteryPrize(provider, chainId, dispatch, lottery)
        await loadToken(provider, chainId, dispatch);
        await loadAccount(dispatch);
        await loadCurrentPrizeWinner(provider, chainId, dispatch, lottery)
        await loadCheckClaimedPrize(provider, chainId, dispatch, lottery)
        await loadTotalWinnings(provider, chainId, dispatch, lottery)

        await loadTokenBalance(provider, account, chainId, dispatch, token)

        dispatch(setDonateToPrize(result));
  }

  export const loadBuyEntries = async (provider, chainId, token, entries, lottery, dispatch) => {
    const signer = await provider.getSigner();
    chainId = await loadNetwork(dispatch, provider)
    lottery = await loadLottery(provider, chainId, dispatch);
    token = await loadToken(provider, chainId, dispatch);
    const account = await loadAccount(dispatch);
    const entryPrice = await loadEntryPrice(provider, chainId, dispatch, lottery)
    const amount = entries.toString();
    const bigAmount = (amount * entryPrice).toString();

        const approveTx = await token.connect(signer).approve(lottery.getAddress(), bigAmount);
        await approveTx.wait();
        console.log("Tokens approved for transfer");

        const tx = await lottery.connect(signer).enterReward(bigAmount)
        const result = await tx.wait()

        await loadLotteryPrize(provider, chainId, dispatch, lottery)
        await loadAccount(dispatch);
        await loadCurrentPrizeWinner(provider, chainId, dispatch, lottery)
        await loadCheckClaimedPrize(provider, chainId, dispatch, lottery)
        await loadTotalWinnings(provider, chainId, dispatch, lottery)

        await loadTokenBalance(provider, account, chainId, dispatch, token)

        dispatch(setEntries(result));
}