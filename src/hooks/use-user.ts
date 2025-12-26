
// src/hooks/useUser.ts
import { useDispatch, useSelector } from "react-redux";
import {type RootState, type AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/user.slice";
import { useCallback } from "react";
import AuthService from "@/modules/auth/services/auth.service";
import type { IUser } from "@/models/User/user.model";
import { useNavigate } from "react-router";
import { routeNames } from "@/router/routes-names";
import { lsAccessToken } from "@/common/constants";

export function useUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  const fetchUser: () => Promise<IUser> = useCallback(async () => {
    try {
      const response = await AuthService.getDetailUser();
      dispatch(setUser(response));
      return response;
    } catch (err: any) {
      console.error("Error fetching user:", err);
      localStorage.removeItem(lsAccessToken);
      navigate(routeNames.initPage, { replace: true });
      throw err;
    }
  }, [dispatch]);

  return {business:user.business ,user, fetchUser };
}
