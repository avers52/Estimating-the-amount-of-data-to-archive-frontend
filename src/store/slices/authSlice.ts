import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  loginName: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loginName: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.loginName = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.loginName = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;