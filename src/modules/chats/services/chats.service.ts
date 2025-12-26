/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosPrivate } from "@/common/api/api.service";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import axios from "axios";
import { controllers, createAbortableRequest } from "@/common/utils/abort_controller";
import type { IConversation } from "@/models/chats/conversation.model";
import { EndpointsApp } from "@/common/api/endpoints";


const getConversations = async (): Promise<IConversation[]> => {
  const key = `getConversations`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(EndpointsApp.chats.conversations,
      { signal, }
    )
    return response.data.data as IConversation[];
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}


const getDetailConversation = async (uuid: string): Promise<IConversation> => {
  const key = `getDetailConversation${uuid}`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(`${EndpointsApp.chats.detailConversation}${uuid}`,
      { signal, }
    )
    return response.data.data as IConversation;
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e);
  } finally {
    delete controllers[key];
  }
}




const ChatService = {
  getConversations,
  getDetailConversation
}

export default ChatService