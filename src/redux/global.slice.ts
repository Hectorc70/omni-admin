import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface GlobalState {
    titleHeader: string;
    isOpenSidebar: boolean;
    backArrow: boolean
}

const initialState: GlobalState = {
    titleHeader: "Inicio",
    isOpenSidebar: true,
    backArrow: false
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        changeTitle: (state, action: PayloadAction<string>) => {
            state.titleHeader = action.payload;
        },
    },
});

export const { changeTitle} = globalSlice.actions;
export default globalSlice.reducer;