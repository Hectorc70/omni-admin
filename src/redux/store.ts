import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./global.slice";
import userReducer from "./user.slice";
import authReducer from "./auth.slice";


export const store = configureStore({
    reducer: {
        global: globalReducer,
        user: userReducer,
        auth: authReducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
