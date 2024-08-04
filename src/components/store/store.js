import { configureStore } from '@reduxjs/toolkit'
import provider from '../reducers/provider'
import lottery from '../reducers/lotteryStore';
import TreasureToken from '../reducers/tokenStore';

export default configureStore({
  reducer: {
    provider,
    lottery,
    TreasureToken,
  },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
        serializableCheck: false
    })
})