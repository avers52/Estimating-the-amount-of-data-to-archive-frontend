import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  minRatio: number;
}

const getInitialRatio = (): number => {
  const saved = sessionStorage.getItem('minRatio');
  return saved ? parseFloat(saved) : 1.0;
};

const initialState: FilterState = {
  minRatio: getInitialRatio(),
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setMinRatio: (state, action: PayloadAction<number>) => {
      state.minRatio = action.payload;
      sessionStorage.setItem('minRatio', String(action.payload));
    },
    resetFilter: (state) => {
      state.minRatio = 1.0;
      sessionStorage.removeItem('minRatio');
    },
  },
});

export const { setMinRatio, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;