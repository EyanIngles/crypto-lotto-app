import { createSlice } from '@reduxjs/toolkit';

export const provider = createSlice({
    name: 'provider',
    initialState: {
        connection: null,
        chainId: null,
        account: null,
        tokenBalance: 0,
    },
    reducers: {
        setProvider: (state, action) => {
            state.connection = action.payload
        },
        setNetwork: (state, action) => {
            state.chainId = action.payload
        },
        setAccount: (state, action) => {
            state.account = action.payload
        },
        setTokenBalance: (state, action) => {
            state.tokenBalance = action.payload
        }
    }
})

export const { setNetwork, setAccount, setProvider, setTokenBalance } = provider.actions;

export default provider.reducer;