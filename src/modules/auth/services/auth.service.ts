/* eslint-disable @typescript-eslint/no-explicit-any */
import { lsAccessToken, lsRefreshToken } from "@/common/constants";
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
const login = async (email: string, password: string): Promise<IUser> => {
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
    const data = response.data.data
    localStorage.setItem(lsRefreshToken, data.refresh_token)
    localStorage.setItem(lsAccessToken, data.access_token)
    await refreshToken()
    return await getDetailUser()
  } catch (e: any) {
    if (axios.isCancel(e) || e.name === "CanceledError" || e.name === "AbortError") {
      return Promise.reject(CANCELLED_REQUEST);
    }
    throw handleError(e)
  } finally {
    delete controllers[key];
  }
}
const createAccount = async (token: string): Promise<IUser> => {
  //
  try {
    const response = await axiosPublic.post(EndpointsApp.auth.createAccount,
      {
        token,
      }
    )
    const data = response.data.data
    localStorage.setItem(lsRefreshToken, data.refresh_token)
    localStorage.setItem(lsAccessToken, data.access_token)
    await refreshToken()
    return await getDetailUser()
  } catch (e: any) {
    throw handleError(e)
  }
}


const refreshToken = async (): Promise<String> => {
  const key = `refreshToken`;
  const signal = createAbortableRequest(key);
  try {
    const response = await axiosPublic.post(EndpointsApp.auth.refreshToken,
      {
        refresh_token: localStorage.getItem(lsRefreshToken),
      }, { signal }
    )
    localStorage.setItem(lsAccessToken, response.data.data.access_token)
    localStorage.setItem(lsRefreshToken, response.data.data.refresh_token)
    return response.data.data
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
  createAccount,
  getDetailUser,
  activateUser
}

export default AuthService
