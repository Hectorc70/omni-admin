import { lsForceLogout } from '@/common/constants';
import AuthService from '@/modules/auth/services/auth.service';
import { setToken } from '@/redux/auth.slice';
import type { AppDispatch } from '@/redux/store';
import { routeNames } from '@/router/routes-names';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useUser } from './use-user';

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const { fetchUser, isAuthenticated } = useUser()
  const authCheckId = useRef(0);

  useEffect(() => {
    const currentCheckId = authCheckId.current + 1;
    authCheckId.current = currentCheckId;
    let isMounted = true;

    const checkAuth = async () => {
      try {
        if (!isMounted || authCheckId.current !== currentCheckId) return
        setLoading(true)
        if (localStorage.getItem(lsForceLogout) === 'true') {
          if (!isMounted || authCheckId.current !== currentCheckId) return
          setAuthorized(false)
          navigate(routeNames.loginPage, { replace: true })
          return
        }
        if (!isAuthenticated) {
          const response = await AuthService.refreshToken()
          if (!isMounted || authCheckId.current !== currentCheckId) return
          dispatch(setToken(response ?? ""));
          await fetchUser()
        }
        if (!isMounted || authCheckId.current !== currentCheckId) return
        setAuthorized(true)
      } catch {
        if (!isMounted || authCheckId.current !== currentCheckId) return
        setAuthorized(false)
        navigate(routeNames.loginPage, { replace: true })
      } finally {
        if (isMounted && authCheckId.current === currentCheckId) {
          setLoading(false)
        }
      }
    };
    void checkAuth();

    return () => {
      isMounted = false;
    }
  }, [dispatch, fetchUser, isAuthenticated, navigate]);

  if (loading) {
    return null;
  }

  return authorized ? children : null;
};

export default RequireAuth;
