// src/common/lib/axios.ts
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { baseApi } from "@/common/constants";
import AuthService from "@/modules/auth/services/auth.service";
import { store } from "@/redux/store";
import { setToken } from "@/redux/auth.slice";

export const axiosPublic = axios.create({
  baseURL: baseApi,
  withCredentials: true
});

// Instancia con auth
export const axiosPrivate = axios.create({
  baseURL: baseApi,
  withCredentials: true
});

// Interceptor para agregar token automáticamente
axiosPrivate.interceptors.request.use(
  (config) => {
    const token =
      store.getState().auth.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



// --- Interceptor de respuesta para manejar expiración ---
axiosPrivate.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Si hay un 401 y no hemos reintentado aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar token desde tu servicio
        const response = await AuthService.refreshToken();
        if (!response) {
          throw new Error("Token refresh failed");
        }
        // Guardar nuevo token
        store.dispatch(
          setToken(response)
        );

        // Actualizar headers y reintentar la solicitud
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${response}`;
        }

        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        // Token inválido → cerrar sesión
        window.location.href="/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

