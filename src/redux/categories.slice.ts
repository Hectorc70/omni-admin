import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ScreenStatus } from "@/types/enums";
import type { IResponsePaginate } from "@/types/response-paginate.model";

interface CategoriesState {
  data: IResponsePaginate;
  statusScreen: ScreenStatus;
  messageScreen: string;
}

const initialState: CategoriesState = {
  data: {
    count: 0,
    next_page: 0,
    results: [],
  },
  statusScreen: ScreenStatus.success,
  messageScreen: "",
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<IResponsePaginate>) => {
      state.data = action.payload;
    },
    setCategoriesStatus: (state, action: PayloadAction<ScreenStatus>) => {
      state.statusScreen = action.payload;
    },
    setCategoriesMessage: (state, action: PayloadAction<string>) => {
      state.messageScreen = action.payload;
    },
  },
});

export const { setCategories, setCategoriesStatus, setCategoriesMessage } = categoriesSlice.actions;
export default categoriesSlice.reducer;
