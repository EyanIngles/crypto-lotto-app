import { configureStore } from '@reduxjs/toolkit'
import provider from '../reducers/provider'
import lottery from '../reducers/lotteryStore';
import blot from '../reducers/blotStore';

export default configureStore({
  reducer: {
    provider,
    lottery,
    blot,
  },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
        serializableCheck: false
    })
})