import { setAccount, setNetwork, setProvider } from "./provider";
import { setContractLottery, setLotteryPrize,
    setDonateToPrize, setEntries, setCheckPrice } from "./lotteryStore";
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

export const loadDonateToPrize = async (provider, amount, lottery, token, chainId, dispatch) => {
    const signer = await provider.getSigner();
    lottery = await loadLottery(provider, chainId, dispatch);
    token = await loadToken(provider, chainId, dispatch);

    const bigAmount = ethers.parseUnits(amount.toString(), 18); // Adjust the decimals as per your token

        const approveTx = await token.connect(signer).approve(lottery.getAddress(), bigAmount);
        await approveTx.wait();
        console.log("Tokens approved for transfer");

    console.log("Provider:", provider);
    console.log("Chain ID:", chainId);
    console.log("Token:", token);
    console.log("Lottery:", lottery);
    console.log("Amount:", amount);
    console.log("Big Amount:", bigAmount.toString());

    try {
        const result = await lottery.connect(signer).donateToPrizeFund({value: bigAmount});
        dispatch(setEntries(result));
    } catch (error) {
        console.error("Error buying entries:", error);
    }
  }
  export const loadBuyEntries = async (provider, chainId, token, entries, lottery, dispatch) => {
    const signer = await provider.getSigner();
    chainId = await loadNetwork(dispatch, provider)
    lottery = await loadLottery(provider, chainId, dispatch);
    token = await loadToken(provider, chainId, dispatch);
    const entryPrice = await loadEntryPrice(provider, chainId, dispatch, lottery)
    const amount = entries.toString();
    const bigAmount = (amount * entryPrice).toString();

    console.log("Provider:", provider);
    console.log("Chain ID:", chainId);
    console.log("Token:", token);
    console.log("Lottery:", lottery);
    console.log("Amount:", entries);
    console.log("Big Amount:", bigAmount);

        const approveTx = await token.connect(signer).approve(lottery.getAddress(), bigAmount);
        await approveTx.wait();
        console.log("Tokens approved for transfer");

        const tx = await lottery.connect(signer).enterReward(amount)
        const result = await tx.wait()
        dispatch(setEntries(result));
}