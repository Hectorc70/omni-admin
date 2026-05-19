/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/common/constants";
import { axiosPrivate } from "@/common/api/api.service";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import axios from "axios";
import { controllers, createAbortableRequest } from "@/common/utils/abort_controller";
import type { IResponsePaginate } from "@/types/response-paginate.model";
import { BusinessProductModel, type IBusinessProduct } from "@/models/Business/business-product.model";

const listAllProducts = async ({ page, text_search }: { page: number, text_search: string }): Promise<IResponsePaginate> => { // eslint-disable-line @typescript-eslint/no-unused-vars: number, text_search: string, type_product: string }): Promise<IResponsePaginate> => {
  const key = `listAllProducts${page}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(`${baseApi}/business/catalog/templates/?page=${page}&text_search=${text_search}`,
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
const createProducts = async ({ data }: { data: IBusinessProduct }): Promise<void> => { // eslint-disable-line @typescript-eslint/no-unused-vars: number, text_search: string, type_product: string }): Promise<IResponsePaginate> => {
  const key = `createProducts${data.name}`;
  const signal = createAbortableRequest(key);

  try {
    const dataJ = new BusinessProductModel(data).toJson();
    await axiosPrivate.post(`${baseApi}/business/catalog/product/`,
      dataJ,
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

const addImageProduct = async ({ uuid_product, file}: { uuid_product: string, file: File }): Promise<void> => { // eslint-disable-line @typescript-eslint/no-unused-vars: number, text_search: string, type_product: string }): Promise<IResponsePaginate> => {
  const key = `addImageProduct${uuid_product}`;
  const signal = createAbortableRequest(key);

  try {
    const formData = new FormData();
    formData.append('file_image', file)
    await axiosPrivate.post(`${baseApi}/business/catalog/product/`,
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


const CatalogService = {
  listAllProducts,
  createProducts,
  addImageProduct
}

export default CatalogService