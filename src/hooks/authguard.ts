import { lsForceLogout } from '@/common/constants';
import AuthService from '@/modules/auth/services/auth.service';
import { setToken } from '@/redux/auth.slice';
import type { AppDispatch } from '@/redux/store';
import { routeNames } from '@/router/routes-names';
import { useState, useEffect, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useUser } from './use-user';

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const { fetchUser, isAuthenticated } = useUser()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        if (localStorage.getItem(lsForceLogout) === 'true') {
          setAuthorized(false)
          navigate(routeNames.loginPage, { replace: true })
          return
        }
        if (!isAuthenticated) {
          const response = await AuthService.refreshToken()
          dispatch(setToken(response ?? ""));
          await fetchUser()
        }
        setAuthorized(true)
      } catch {
        setAuthorized(false)
        navigate(routeNames.loginPage, { replace: true })
      } finally {
        setLoading(false)
      }
    };
    checkAuth();
  }, [dispatch, fetchUser, isAuthenticated, navigate]);

  if (loading) {
    return null;
  }

  return authorized ? children : null;
};

export default RequireAuth;
