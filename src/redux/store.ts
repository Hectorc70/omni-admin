import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./global.slice";
import userReducer from "./user.slice";
import chatsReducer from "@/modules/chats/store/chats.slice";


export const store = configureStore({
    reducer: {
        global: globalReducer,
        user: userReducer,
        chats: chatsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
