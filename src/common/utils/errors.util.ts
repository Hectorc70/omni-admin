/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosError } from "axios";
export const CANCELLED_REQUEST = Symbol('Request was cancelled');

export const handleError = (e: unknown): string => {
  if (e === undefined) {
    return 'Error desconocido';
  }
  if (e instanceof AxiosError) {
    const responseData = e.response?.data;
    if (typeof responseData === 'string') {
      return responseData.toString();
    }

    if (responseData?.data?.error_details) {
      return responseData.data.error_details;
    }
    if (responseData?.data?.message) {
      return responseData.data.message;
    }


    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.statusText) {
      return responseData.statusText;
    }

    return e.message || 'Error desconocido de Axios';
  }

  if (e instanceof Error) {
    return e.message;
  }

  return 'Sucedió algo inesperado: ' + JSON.stringify(e);
};


