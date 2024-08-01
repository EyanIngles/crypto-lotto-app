import { createSlice } from '@reduxjs/toolkit';

export const blot = createSlice({
    name: 'blot',
    initialState: {
        contract: 0,
    },
    reducers: {
        setContractBLOT: (state, action) => {
            state.contract = action.payload
        },
    }
})

export const { setContractBLOT } = blot.actions;

export default blot.reducer;