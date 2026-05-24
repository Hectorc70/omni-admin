import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CANCELLED_REQUEST } from "@/common/utils/errors.util";
import CatalogService from "@/modules/catalog/services/catalog.service";
import type { IBusinessCategory } from "@/models/Business/business-category.model";
import { setCategories, setCategoriesMessage, setCategoriesStatus } from "@/redux/categories.slice";
import type { AppDispatch, RootState } from "@/redux/store";
import { ScreenStatus } from "@/types/enums";

const getErrorMessage = (error: unknown) => error instanceof Error ? error.toString() : String(error)

export function useCategories() {
  const dispatch = useDispatch<AppDispatch>();
  const categoriesState = useSelector((state: RootState) => state.categories);

  const fetchCategories = useCallback(async ({ page = 1, text_search = "" }: { page?: number, text_search?: string } = {}) => {
    try {
      dispatch(setCategoriesStatus(ScreenStatus.loading));
      const response = await CatalogService.listAllCategories({ page, text_search });
      dispatch(setCategories(response));
      dispatch(setCategoriesMessage(""));
      dispatch(setCategoriesStatus(ScreenStatus.success));
      return response;
    } catch (error: unknown) {
      if (error !== CANCELLED_REQUEST) {
        dispatch(setCategoriesStatus(ScreenStatus.error));
        dispatch(setCategoriesMessage(getErrorMessage(error)));
      }
      throw error;
    }
  }, [dispatch]);

  return {
    categoriesData: categoriesState.data,
    categories: categoriesState.data.results as IBusinessCategory[],
    statusScreen: categoriesState.statusScreen,
    messageScreen: categoriesState.messageScreen,
    fetchCategories,
  };
}
