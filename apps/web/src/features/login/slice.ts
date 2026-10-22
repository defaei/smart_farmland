import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Status } from "@/shared/types";
import type { LoginDataPayload, LoginInitialState } from "./types";

const initialState: LoginInitialState = {
  isPasswordVisible: false,
  data: {
    username: "",
    password: "",
  },
  status: "idle",
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
    setLoginStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
  },
});

export const { setLoginData, setLoginStatus, togglePasswordVisibility } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
