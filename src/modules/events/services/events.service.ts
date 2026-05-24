/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosPrivate } from "@/common/api/api.service";
import { EndpointsApp } from "@/common/api/endpoints";
import { controllers, createAbortableRequest } from "@/common/utils/abort_controller";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import { EventModel, type IEvent } from "@/models/Events/event.model";
import type { IResponsePaginate } from "@/types/response-paginate.model";
import axios from "axios";

const listEvents = async ({ page, text_search }: { page: number, text_search: string }): Promise<IResponsePaginate> => {
  const key = `listEvents${page}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(`${EndpointsApp.business.eventsFilter}?text_search=${text_search}&page=${page}`,
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

const createEvent = async ({ data }: { data: IEvent }): Promise<IEvent> => {
  const key = `createEvent${data.name}`;
  const signal = createAbortableRequest(key);

  try {
    const dataJ = new EventModel(data).toFormData();
    const response = await axiosPrivate.post(EndpointsApp.business.events,
      dataJ,
      { signal, headers: { "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>" } }
    )

    return response.data.data as IEvent;
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}

const updateEvent = async ({ uuid_event, data }: { uuid_event: string, data: IEvent }): Promise<IEvent> => {
  const key = `updateEvent${uuid_event}`;
  const signal = createAbortableRequest(key);

  try {
    const dataJ = new EventModel(data).toFormData();
    const response = await axiosPrivate.put(`${EndpointsApp.business.events}${uuid_event}`,
      dataJ,
      { signal, headers: { "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>" } }
    )

    return response.data.data as IEvent;
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}

const deleteEvent = async ({ uuid_event }: { uuid_event: string }): Promise<void> => {
  const key = `deleteEvent${uuid_event}`;
  const signal = createAbortableRequest(key);

  try {
    await axiosPrivate.delete(`${EndpointsApp.business.events}${uuid_event}`,
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

const EventsService = {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent
}

export default EventsService
