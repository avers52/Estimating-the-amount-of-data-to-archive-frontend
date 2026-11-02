import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  minRatio: number;
}

const initialState: FilterState = {
  minRatio: 1.0,
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setMinRatio: (state, action: PayloadAction<number>) => {
      state.minRatio = action.payload;
    },
    resetFilter: (state) => {
      state.minRatio = 1.0;
    },
  },
});

export const { setMinRatio, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;