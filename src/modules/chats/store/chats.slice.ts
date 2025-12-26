import type { IConversation } from "@/models/chats/conversation.model";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


const initialState = {
  chatSelected: null as IConversation | null,
  chats: [] as IConversation[],
};

export const userSlice = createSlice({
  name: "chats",
  initialState, reducers: {
    setSelectedChat: (state, action: PayloadAction<IConversation>) => {
      state.chatSelected = action.payload;
    },
    setChats: (state, action: PayloadAction<IConversation[]>) => {
      state.chats = action.payload;
    },
    setUnSelectedChat: (state) => {
      state.chatSelected = null;
    },
  },

});

export const { setChats, setSelectedChat, setUnSelectedChat } = userSlice.actions;
export default userSlice.reducer;
