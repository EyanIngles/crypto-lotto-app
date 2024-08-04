import { createSlice } from '@reduxjs/toolkit';

export const lottery = createSlice({
    name: 'lottery',
    initialState: {
        lotteryContract: null,
        lotteryPrize: 0,
        donateToPrize: 0,
        entries: 0,
        checkEntryPrice: 0,

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
    }
})

export const { setContractLottery, setLotteryPrize, setDonateToPrize, setEntries, setCheckPrice } = lottery.actions;

export default lottery.reducer;