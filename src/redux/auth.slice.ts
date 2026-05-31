import { createSlice,type PayloadAction } from "@reduxjs/toolkit";


const initialState = {
  access_token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
    },
    clearToken: (state) => {
      state.access_token = "";
    },
  },


});

export const { setToken, clearToken} = authSlice.actions;
export default authSlice.reducer;
