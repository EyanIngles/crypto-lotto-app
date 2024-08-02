import { setAccount, setNetwork, setProvider } from "./provider";
import { ethers } from "ethers";
import { setContractLottery, setLotteryPrize, setDonateToPrize } from "./lotteryStore";
import { setContractTztk } from './tztkStore';
import TZTK_ABI from '../abis/TZTK_ABI.json';
import LOTTERY_ABI from '../abis/LOTTERY_ABI.json';
import config from '../abis/config.json';


export const loadProvider = async (dispatch) => {
    try{
    const provider = new ethers.BrowserProvider(window.ethereum)
    dispatch(setProvider(provider))

    return provider;
    } catch(err) {
        window.alert('provider unable to be located')
    }}

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

export const loadTztk = async (provider, chainId, dispatch) => {
    const tztk = new ethers.Contract(config[chainId].tztk.address, TZTK_ABI, provider)

    dispatch(setContractTztk(tztk))

    return tztk
}

export const loadLotteryPrize = async (provider, chainId, dispatch, lottery, tztk) => {
    lottery = await loadLottery(provider, chainId, dispatch);
    tztk = await loadTztk(provider, chainId, dispatch);
    const lotteryPrizeBignumber = await tztk.balanceOf(lottery.getAddress());
    const lotteryPrize = ethers.formatEther(lotteryPrizeBignumber);
    dispatch(setLotteryPrize(lotteryPrize));

    return lotteryPrize
}

export const loadDonateToPrize = async (provider, chainId, lottery, tztk, amount, dispatch) => {
    const signer = await provider.getSigner()
    lottery = loadLottery(provider, chainId, dispatch);
    tztk = loadTztk(provider, chainId, dispatch);
    const transaction = await lottery.connect(signer).donateToPrize(tztk.address, { value: ethers.parseEther(amount.toString()) });
    const result = await transaction.wait();

    dispatch(setDonateToPrize(result));

    return result;
  };
export const loadBuyEntries = async () => {
    // am going to want to access tokens and lottery contract and send a value of however many tokens are needed for the entries.
}
