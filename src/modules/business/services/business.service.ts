/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosPrivate } from "@/common/api/api.service";
import { BusinessModel, type IBusiness } from "@/models/Business/business.model";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import axios from "axios";
import { controllers, createAbortableRequest } from "@/common/utils/abort_controller";
import { EndpointsApp } from "@/common/api/endpoints";

const createBusiness = async (model: IBusiness): Promise<void> => {
  const key = `createBusiness${model.name}`;
  const signal = createAbortableRequest(key);

  try {
    const data = new BusinessModel(model).toFormData();
    await axiosPrivate.post(EndpointsApp.business.create,
      data,
      { signal, }
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

const updateBusiness = async (model: IBusiness): Promise<void> => {
  const key = `updateBusiness${model.name}`;
  const signal = createAbortableRequest(key);

  try {
    const data = new BusinessModel(model).toFormData();
    await axiosPrivate.put(`${EndpointsApp.business.update}/${model.uuid}`,
      data,
      { headers: { "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>" },
      signal, }
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


const BusinessService = {
  createBusiness,
  updateBusiness,
}

export default BusinessService