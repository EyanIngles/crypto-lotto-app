import { createSlice } from '@reduxjs/toolkit';

export const tztk = createSlice({
    name: 'tztk',
    initialState: {
        tztkContract: null,
        name: "",
        symbol: "",
    },
    reducers: {
        setContractTztk: (state, action) => {
            state.tztkContract = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setSymbol: (state, action) => {
            state.symbol = action.payload;
        },
    },
});

export const { setContractTztk, setName, setSymbol } = tztk.actions;

export default tztk.reducer;
