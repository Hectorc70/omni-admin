/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
export const CANCELLED_REQUEST = Symbol('Request was cancelled');

export const handleError = (e: unknown): string => {
  if (e === undefined) {
    return 'Error desconocido';
  }
  if (e instanceof FirebaseError) {
    return messagefirebase(e.code)
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


const messagefirebase = (code: string) => {
  switch (code) {
    case 'auth/wrong-password':
      return 'Contraseña incorrecta'
    case 'auth/user-not-found':
      return 'El correo no esta registrado'
    case 'auth/email-already-in-use':
      return 'El correo ya esta registrado'
    case 'auth/invalid-credential':
      return 'Usuario no registrado'
    case 'Firebase: Error (auth/internal-error).':
      return 'Sin acceso a internet';

    default:
      return 'Error desconocido'
  }
}