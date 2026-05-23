
// src/hooks/useUser.ts
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/user.slice";
import { setToken } from "@/redux/auth.slice";
import { useCallback } from "react";
import AuthService from "@/modules/auth/services/auth.service";
import type { IUser } from "@/models/User/user.model";
import { useNavigate } from "react-router";
import { routeNames } from "@/router/routes-names";

export function useUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.access_token
  );

  const fetchUser: () => Promise<IUser> = useCallback(async () => {
    try {
      const response = await AuthService.getDetailUser();
      dispatch(setUser(response));
      return response;
    } catch (err: any) {
      console.error("Error fetching user:", err);
      navigate(routeNames.initPage, { replace: true });
      throw err;
    }
  }, [dispatch]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const loginResponse = await AuthService.login(email, password);
      dispatch(setToken(loginResponse));
      await fetchUser();
    } catch (err: any) {
      console.error("Error fetching user:", err);
      navigate(routeNames.initPage, { replace: true });
      throw err;
    }
  }, [dispatch]);

  return { business: user.business, user, fetchUser, login, isAuthenticated: isAuthenticated ?? false };
}
