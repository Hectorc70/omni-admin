import { baseApi } from "../constants";

export const EndpointsApp = {
  auth: {
    login: `${baseApi}/users/user/login/`,
    createAccount: `${baseApi}/users/user/create-account/`,
    refreshToken: `${baseApi}/users/user/refresh-token`,
    detailUser: `${baseApi}/users/user/`,
  },
  business: {
    create: `${baseApi}/business/create/`,
    update: `${baseApi}/business/update/`,
    updateContactInfo: `${baseApi}/business/contact-info/`,
    updateHours: `${baseApi}/business/hours/`,
  },
  chats: {
    conversations: `${baseApi}/chats/conversations/`,
    detailConversation: `${baseApi}/chats/conversation/`,
  }
}

const VITE_BASE_WS = import.meta.env.VITE_BASE_WS;

export const WSAppUrls= {
  chat: `${VITE_BASE_WS}/ws/chat/`,
}
