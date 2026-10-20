import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoginDataPayload, LoginInitialState } from "./types";

const initialState: LoginInitialState = {
  isPasswordVisible: false,
  data: {
    username: "",
    password: "",
  },
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    togglePasswordVisibility(state) {
      state.isPasswordVisible = !state.isPasswordVisible;
    },
    setLoginData(state, action: PayloadAction<LoginDataPayload>) {
      state.data[action.payload.field] = action.payload.value;
    },
  },
});

export const { setLoginData, togglePasswordVisibility } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
