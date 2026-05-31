/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosPrivate } from "@/common/api/api.service";
import { EndpointsApp } from "@/common/api/endpoints";
import { controllers, createAbortableRequest } from "@/common/utils/abort_controller";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import { PromotionModel, type IPromotion } from "@/models/Promotions/promotion.model";
import type { IResponsePaginate } from "@/types/response-paginate.model";
import axios from "axios";

const listPromotions = async ({ page, text_search }: { page: number, text_search: string }): Promise<IResponsePaginate> => {
  const key = `listPromotions${page}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(`${EndpointsApp.business.promotionsFilter}?text_search=${text_search}&page=${page}`,
      { signal }
    )

    const responseData = response.data.data as IResponsePaginate;
    return responseData;
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}

const createPromotion = async ({ data }: { data: IPromotion }): Promise<IPromotion> => {
  const key = `createPromotion${data.name}`;
  const signal = createAbortableRequest(key);

  try {
    const dataJ = new PromotionModel(data).toFormData();
    const response = await axiosPrivate.post(EndpointsApp.business.promotions,
      dataJ,
      { signal, headers: { "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>" } }
    )

    return response.data.data as IPromotion;
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}

const updatePromotion = async ({ uuid_promotion, data }: { uuid_promotion: string, data: IPromotion }): Promise<IPromotion> => {
  const key = `updatePromotion${uuid_promotion}`;
  const signal = createAbortableRequest(key);

  try {
    const dataJ = new PromotionModel(data).toFormData();
    const response = await axiosPrivate.put(`${EndpointsApp.business.promotions}${uuid_promotion}`,
      dataJ,
      { signal, headers: { "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>" } }
    )

    return response.data.data as IPromotion;
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}

const deletePromotion = async ({ uuid_promotion }: { uuid_promotion: string }): Promise<void> => {
  const key = `deletePromotion${uuid_promotion}`;
  const signal = createAbortableRequest(key);

  try {
    await axiosPrivate.delete(`${EndpointsApp.business.promotions}${uuid_promotion}`,
      { signal }
    )

    return;
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}

const PromotionsService = {
  listPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
}

export default PromotionsService
