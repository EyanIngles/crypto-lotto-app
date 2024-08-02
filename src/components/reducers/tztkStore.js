import { createSlice } from '@reduxjs/toolkit';

export const tztk = createSlice({
    name: 'tztk',
    initialState: {
        tztkContract: null,
    },
    reducers: {
        setContractTztk: (state, action) => {
            state.tztkContract = action.payload;
        },
    },
});

export const { setContractTztk } = tztk.actions;

export default tztk.reducer;
