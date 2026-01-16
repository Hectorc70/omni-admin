/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/common/constants";
import { axiosPrivate } from "@/common/api/api.service";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import axios from "axios";
import { controllers, createAbortableRequest } from "@/common/utils/abort_controller";
import type { IResponsePaginate } from "@/types/response-paginate.model";

const listCustomers = async ({ page, text_search}: { page: number, text_search: string}):  Promise<IResponsePaginate> => { // eslint-disable-line @typescript-eslint/no-unused-vars: number, text_search: string, type_product: string }): Promise<IResponsePaginate> => {
  const key = `listCustomers${page}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(`${baseApi}/customers/?page=${page}&text_search=${text_search}`,
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
const CustomerService = {
  listCustomers,
}

export default CustomerService