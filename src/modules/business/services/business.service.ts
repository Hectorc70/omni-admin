/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosPrivate } from "@/common/api/api.service";
import { BusinessModel, type IBusiness } from "@/models/Business/business.model";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import axios from "axios";
import { controllers, createAbortableRequest } from "@/common/utils/abort_controller";
import { BusinessHoursModel, type IBusinessHours } from "@/models/Business/business-hours.model";
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
    await axiosPrivate.put(EndpointsApp.business.update,
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


const updateContactInfo = async (model: IBusiness): Promise<void> => {
  const key = `updateContactInfo${model.uuid}`;
  const signal = createAbortableRequest(key);

  try {
    const data = new BusinessModel(model).toJsonContactInfo();
    await axiosPrivate.put(EndpointsApp.business.updateContactInfo,
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
const updateHours = async (hours: IBusinessHours[]): Promise<void> => {
  const key = `updateHours`;
  const signal = createAbortableRequest(key);

  try {

    const data = Array<Object>();
    hours.forEach((hour: IBusinessHours) => {
      data.push(new BusinessHoursModel(hour).toJson())

    })
    await axiosPrivate.put(EndpointsApp.business.updateHours,
      {
        hours: data
      },
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


const BusinessService = {
  createBusiness,
  updateBusiness,
  updateContactInfo,
  updateHours
}

export default BusinessService