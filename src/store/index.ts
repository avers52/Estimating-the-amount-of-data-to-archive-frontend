import { configureStore } from '@reduxjs/toolkit';
import algoReducer from './slices/algoSlice';
import authReducer from './slices/authSlice';
import filterReducer from './slices/filterSlice';

export const store = configureStore({
  reducer: {
    algorithms: algoReducer,
    auth: authReducer,
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;