/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosPrivate, axiosPublic } from "@/common/api/api.service";
import { controllers, createAbortableRequest } from "@/common/utils/abort_controller";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import { type IUser } from "@/models/User/user.model";
import axios from "axios";
import { EndpointsApp } from "@/common/api/endpoints";

const activateUser = async (token: string, password: string): Promise<void> => {
  const key = `activateUser${token}`;
  const signal = createAbortableRequest(key);
  try {
    const response = await axiosPublic.post(EndpointsApp.auth.activateUser,
      {
        token,
        password
      },
      { signal }
    )
    return response.data.data
  } catch (e: any) {
    throw handleError(e)
  }
}
const login = async (email: string, password: string): Promise<string> => {
  const key = `login${email}`;
  const signal = createAbortableRequest(key);
  try {

    const response = await axiosPublic.post(EndpointsApp.auth.login,
      {
        email,
        password
      },
      { signal }
    )
    const access_token = response.data.data.access_token
    return access_token
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e)
  } finally {
    delete controllers[key];
  }
}


const refreshToken = async (): Promise<string> => {
  const key = `refreshToken`;
  const signal = createAbortableRequest(key);
  try {
    const response = await axiosPublic.get(EndpointsApp.auth.refreshToken,{ signal}
    )
    return response.data.data.access_token
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e)
  } finally {
    delete controllers[key];
  }
}

const getDetailUser = async (): Promise<IUser> => {
  const key = `getDetailUser`;
  const signal = createAbortableRequest(key);

  try {
    const response = await axiosPrivate.get(EndpointsApp.auth.detailUser, { signal })
    return response.data.data as IUser
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e)
  } finally {
    delete controllers[key];
  }
}


const AuthService = {
  login,
  refreshToken,
  getDetailUser,
  activateUser
}

export default AuthService
