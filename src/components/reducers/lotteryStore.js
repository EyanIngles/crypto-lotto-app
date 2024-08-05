import { createSlice } from '@reduxjs/toolkit';

export const lottery = createSlice({
    name: 'lottery',
    initialState: {
        lotteryContract: null,
        lotteryPrize: 0,
        donateToPrize: 0,
        entries: 0,
        checkEntryPrice: 0,
        triggerAmount: 0,
        currentPrizeWinner: null,
        prizeBeenClaimed: false,
        currentWinAmount: 0,
        totalWinnings: 0,
    },
    reducers: {
        setContractLottery: (state, action) => {
            state.lotteryContract = action.payload
        },
        setLotteryPrize: (state, action) => {
            state.lotteryPrize = action.payload
        },
        setDonateToPrize: (state, action) => {
            state.donateToPrize = action.payload
        },
        setEntries: (state, action) => {
            state.entries = action.payload
        },
        setCheckPrice: (state, action) => {
            state.checkEntryPrice = action.payload
        },
        setCheckTriggerAmount: (state, action) => {
            state.triggerAmount = action.payload
        },
        setCheckPrizeWinner: (state, action) => {
            state.currentPrizeWinner = action.payload
        },
        setCheckClaimedPrize: (state, action) => {
            state.prizeBeenClaimed = action.payload
        },
        setCurrentWinAmount: (state, action) => {
            state.currentWinAmount = action.payload
        },
        setTotalWinnings: (state, action) => {
            state.totalWinnings = action.payload
        },
    }
})

export const { setContractLottery, setLotteryPrize, setDonateToPrize,
    setEntries, setCheckPrice, setCheckTriggerAmount,
    setCheckPrizeWinner, setCheckClaimedPrize, setCurrentWinAmount, setTotalWinnings } = lottery.actions;

export default lottery.reducer;