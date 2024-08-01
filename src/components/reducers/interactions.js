import { setAccount, setNetwork, setProvider } from "./provider";
import { ethers } from "ethers";
import { setContractLottery, setLotteryPrize } from "./lotteryStore";
import { setContractBLOT } from './blotStore';
import BLOT_ABI from '../abis/BLOT_ABI.json';
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

export const loadBLOT = async (provider, chainId, dispatch) => {
    const blot = new ethers.Contract(config[chainId].BLOT.address, BLOT_ABI, provider)

    dispatch(setContractBLOT(blot))

    return blot
}

export const loadLotteryPrize = async (provider, chainId, dispatch, lottery, blot) => {
    lottery = await loadLottery(provider, chainId, dispatch);
    blot = await loadBLOT(provider, chainId, dispatch);
    const lotteryPrizeBignumber = await blot.balanceOf(lottery.getAddress());
    const lotteryPrize = ethers.formatEther(lotteryPrizeBignumber);
    dispatch(setLotteryPrize(lotteryPrize));

    return lotteryPrize
}