import { createSlice } from '@reduxjs/toolkit';

export const token = createSlice({
    name: 'token',
    initialState: {
        tokenContract: null,
        name: "",
        symbol: "",
    },
    reducers: {
        setContractToken: (state, action) => {
            state.tokenContract = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setSymbol: (state, action) => {
            state.symbol = action.payload;
        },
    },
});

export const { setContractToken, setName, setSymbol } = token.actions;

export default token.reducer;
