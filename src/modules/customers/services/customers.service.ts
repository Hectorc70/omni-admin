/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosPrivate } from "@/common/api/api.service";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import axios from "axios";
import { controllers, createAbortableRequest } from "@/common/utils/abort_controller";
import type { IResponsePaginate } from "@/types/response-paginate.model";
import { EndpointsApp } from "@/common/api/endpoints";

const listCustomers = async ({ page, text_search}: { page: number, text_search: string}):  Promise<IResponsePaginate> => {
  const key = `listCustomers${page}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(`${EndpointsApp.business.customers}?page=${page}&text_search=${text_search}`,
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
