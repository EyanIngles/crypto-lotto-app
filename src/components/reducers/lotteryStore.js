import { createSlice } from '@reduxjs/toolkit';

export const lottery = createSlice({
    name: 'lottery',
    initialState: {
        contract: 0,
        lotteryPrize: 0,
    },
    reducers: {
        setContractLottery: (state, action) => {
            state.contract = action.payload
        },
        setLotteryPrize: (state, action) => {
            state.lotteryPrize = action.payload
        },
    }
})

export const { setContractLottery, setLotteryPrize } = lottery.actions;

export default lottery.reducer;