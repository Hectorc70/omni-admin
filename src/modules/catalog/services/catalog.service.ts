/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosPrivate } from "@/common/api/api.service";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import axios from "axios";
import { controllers, createAbortableRequest } from "@/common/utils/abort_controller";
import type { IResponsePaginate } from "@/types/response-paginate.model";
import { BusinessProductModel, type IBusinessProduct } from "@/models/Business/business-product.model";
import { EndpointsApp } from "@/common/api/endpoints";
import type { IBusinessCategory } from "@/models/Business/business-category.model";

const listAllProducts = async ({ page, text_search }: { page: number, text_search: string }): Promise<IResponsePaginate> => {
  const key = `listAllProducts${page}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(`${EndpointsApp.business.products}?page=${page}&text_search=${text_search}`,
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
const createProducts = async ({ data }: { data: IBusinessProduct }): Promise<IBusinessProduct> => {
  const key = `createProducts${data.name}`;
  const signal = createAbortableRequest(key);

  try {
    const dataJ = new BusinessProductModel(data).toJson();
    const response = await axiosPrivate.post(EndpointsApp.business.addProduct,
      dataJ,
      { signal }
    )

    return response.data.data as IBusinessProduct;
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}

const updateProduct = async ({ uuid_product, data }: { uuid_product: string, data: IBusinessProduct }): Promise<IBusinessProduct> => {
  const key = `updateProduct${uuid_product}`;
  const signal = createAbortableRequest(key);

  try {
    const dataJ = new BusinessProductModel(data).toJson();
    const response = await axiosPrivate.put(`${EndpointsApp.business.addProduct}${uuid_product}`,
      dataJ,
      { signal }
    )

    return response.data.data as IBusinessProduct;
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}

const addImageProduct = async ({ uuid_product, file }: { uuid_product: string, file: File | undefined}): Promise<void> => {
  const key = `addImageProduct${uuid_product}`;
  const signal = createAbortableRequest(key);

  try {
    if(!file) return
    const formData = new FormData();
    formData.append('file_image', file);
    formData.append('uuid_product', uuid_product)
    await axiosPrivate.post(EndpointsApp.business.addImageProduct,
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

const listAllCategories = async ({ page, text_search }: { page: number, text_search: string }): Promise<IResponsePaginate> => {
  const key = `listAllCategories${page}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(`${EndpointsApp.business.categoriesFilter}?text_search=${text_search}&page=${page}`,
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

const createCategory = async ({ data }: { data: IBusinessCategory }): Promise<IBusinessCategory> => {
  const key = `createCategory${data.name}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.post(EndpointsApp.business.categories,
      data,
      { signal }
    )

    return response.data.data as IBusinessCategory;
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}

const updateCategory = async ({ uuid_category, data }: { uuid_category: string, data: IBusinessCategory }): Promise<IBusinessCategory> => {
  const key = `updateCategory${uuid_category}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.put(`${EndpointsApp.business.categories}${uuid_category}`,
      data,
      { signal }
    )

    return response.data.data as IBusinessCategory;
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}

const deleteCategory = async ({ uuid_category }: { uuid_category: string }): Promise<void> => {
  const key = `deleteCategory${uuid_category}`;
  const signal = createAbortableRequest(key);

  try {
    await axiosPrivate.delete(`${EndpointsApp.business.categories}${uuid_category}`,
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

const CatalogService = {
  listAllProducts,
  createProducts,
  updateProduct,
  addImageProduct,
  listAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
}

export default CatalogService
