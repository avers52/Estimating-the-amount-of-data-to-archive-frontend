import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  loginName: string | null;
}

const savedLogin = sessionStorage.getItem('loginName');

const initialState: AuthState = {
  isAuthenticated: Boolean(savedLogin),
  loginName: savedLogin,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.loginName = action.payload;
      sessionStorage.setItem('loginName', action.payload);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.loginName = null;
      sessionStorage.removeItem('loginName');
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;