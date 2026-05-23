/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AuthService from '@/modules/auth/services/auth.service';
import { routeNames } from '@/router/routes-names';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from './use-user';
import { useDispatch } from 'react-redux';
import { setToken } from '@/redux/auth.slice';

const RequireAuth = ({ children }: any) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { fetchUser, isAuthenticated } = useUser()
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        if (!isAuthenticated) {
          const response = await AuthService.refreshToken()
          dispatch(
            setToken(
              response ?? ""
            )
          );
          await fetchUser()

        }
        setLoading(false)
      } catch (error: any) {
        navigate(routeNames.loginPage, { replace: true })
      }
      finally {
        setLoading(false)
      }
    };
    checkAuth();
  }, [navigate]);

  if (loading) {
    return null; // Renderizar nada durante el estado de carga
  }

  return isAuthenticated ? children : null; // Render children only if authenticated
};

export default RequireAuth;
