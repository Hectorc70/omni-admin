import { type IUser } from "@/models/User/user.model";
import { createSlice,type PayloadAction } from "@reduxjs/toolkit";


const initialState: IUser = {
  uuid: "",
  first_name: "",
  email: "",
  active: false,
  external_id: "",
  username: "",
  modules: [],
  business: undefined
};

export const userSlice = createSlice({
  name: "user",
  initialState,  reducers: {
    // Acción para actualizar el usuario completo
    setUser: (state, action: PayloadAction<IUser>) => {
      state.username = action.payload.username;
      state.modules = action.payload.modules;
      state.email = action.payload.email;
      state.active = action.payload.active;
      state.external_id = action.payload.external_id;
      state.uuid = action.payload.uuid;
      state.business = action.payload.business;
    },
  },

});

export const { setUser} = userSlice.actions;
export default userSlice.reducer;
