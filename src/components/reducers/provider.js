import { createSlice } from '@reduxjs/toolkit';

export const provider = createSlice({
    name: 'provider',
    initialState: {
        connection: null,
        chainId: null,
        account: null
    },
    reducers: {
        setNetwork: (state, action) => {
            state.chainId = action.payload
        },
        setAccount: (state, action) => {
            state.account = action.payload
        },
        setProvider: (state, action) => {
            state.connection = action.payload
        }
    }
})

export const { setNetwork, setAccount, setProvider } = provider.actions;

export default provider.reducer;