/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/common/constants";
import { axiosPrivate } from "@/common/api/api.service";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import axios from "axios";
import { controllers, createAbortableRequest } from "@/common/utils/abort_controller";
import type { IResponsePaginate } from "@/types/response-paginate.model";
import { NotificationTemplateModel, type INotificationTemplate } from "@/models/Notifications/notification-template.model";

const listNotificationsTemplates = async ({ page, text_search }: { page: number, text_search: string }): Promise<IResponsePaginate> => { // eslint-disable-line @typescript-eslint/no-unused-vars: number, text_search: string, type_product: string }): Promise<IResponsePaginate> => {
  const key = `listNotificationsTemplates${page}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(`${baseApi}/business/notifications/templates/?page=${page}&text_search=${text_search}`,
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
const createTemplate = async ({ data }: { data: INotificationTemplate }): Promise<void> => { // eslint-disable-line @typescript-eslint/no-unused-vars: number, text_search: string, type_product: string }): Promise<IResponsePaginate> => {
  const key = `createTemplate${data.name_template}`;
  const signal = createAbortableRequest(key);

  try {
    const dataJ = new NotificationTemplateModel(data).toFormData();
    await axiosPrivate.post(`${baseApi}/business/notifications/templates/`,
      dataJ,
      { headers: { "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>" }, signal }
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

const sendNotification = async ({ uuidTemplate }: { uuidTemplate: string }): Promise<void> => { // eslint-disable-line @typescript-eslint/no-unused-vars: number, text_search: string, type_product: string }): Promise<IResponsePaginate> => {
  const key = `sendNotification${uuidTemplate}`;
  const signal = createAbortableRequest(key);

  try {
    await axiosPrivate.post(`${baseApi}/business/notifications/send/`,
      { uuid_template: uuidTemplate },
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
const deleteTemplateNotification = async ({ uuidTemplate }: { uuidTemplate: string }): Promise<void> => { // eslint-disable-line @typescript-eslint/no-unused-vars: number, text_search: string, type_product: string }): Promise<IResponsePaginate> => {
  const key = `deleteTemplateNotification${uuidTemplate}`;
  const signal = createAbortableRequest(key);

  try {
    await axiosPrivate.delete(`${baseApi}/business/notifications/templates/${uuidTemplate}`,
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
const NotificationsService = {
  listNotificationsTemplates,
  createTemplate,
  sendNotification,
  deleteTemplateNotification
}

export default NotificationsService