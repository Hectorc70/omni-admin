/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/common/constants";
import { axiosPrivate } from "@/common/api/api.service";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import axios from "axios";
import { controllers, createAbortableRequest } from "@/common/utils/abort_controller";
import { ProductModel, type IProduct } from "@/models/Stock/product.model";
import type { IResponsePaginate } from "@/types/response-paginate.model";

const createProduct = async (model: IProduct): Promise<IProduct> => {
  const key = `createProduct${model.name}`;
  const signal = createAbortableRequest(key);

  try {
    const data = new ProductModel(model).toJson();
    const response = await axiosPrivate.post(`${baseApi}/stock/product/`,
      data,
      { signal }
    )
    return response.data.data;
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}
const updateImageProduct = async (uuid: string, file: File): Promise<void> => {
  const key = `updateImageProduct${uuid}`;
  const signal = createAbortableRequest(key);

  try {
    const formData = new FormData();
    formData.append('file_image', file)
    await axiosPrivate.put(`${baseApi}/stock/product/image/${uuid}`,
      formData,
      { signal, headers: { "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>" } }
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

const updateProduct = async (model: IProduct): Promise<void> => {
  const key = `updateProduct${model.uuid}`;
  const signal = createAbortableRequest(key);

  try {
    const data = new ProductModel(model).toJson();
    await axiosPrivate.put(`${baseApi}/stock/product/${model.uuid}`,
      data,
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

const listProducts = async ({ page, text_search, type_product="1,2" }: { page: number, text_search: string, type_product: string }): Promise<IResponsePaginate> => {
  const key = `listProducts${page}${text_search}${type_product}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(`${baseApi}/stock/filtered?page=${page}&text_search=${text_search}&type_product=${type_product}`,
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

const detailProduct = async ({ uuid}: { uuid: string }): Promise<IProduct> => { // eslint-disable-line @typescript-eslint/no-unused-vars: number, text_search: string, type_product: string }): Promise<IResponsePaginate> => {
  const key = `detailProduct${uuid}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(`${baseApi}/stock/product/${uuid}`,
      { signal }
    )

    const responseData = response.data.data as IProduct;
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
const StockService = {
  createProduct,
  updateProduct,
  updateImageProduct,
  listProducts,
  detailProduct
}

export default StockService