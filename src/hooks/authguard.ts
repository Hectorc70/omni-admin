/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AuthService from '@/modules/auth/services/auth.service';
import { routeNames } from '@/router/routes-names';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from './use-user';
import { lsAccessToken, lsRefreshToken } from '@/common/constants';

const RequireAuth = ({ children }: any) => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { fetchUser } = useUser()
  

  useEffect(() => {
    const token = localStorage.getItem(lsRefreshToken);
    if (!token) {
      navigate(routeNames.initPage, { replace: true });
      return;
    }
    const checkAuth = async () => {
      try {
        setLoading(true)
        await AuthService.refreshToken()
        await fetchUser()
        setLoading(false)
        setIsAuthenticated(true)
      } catch (error: any) {
        setLoading(false)
        setIsAuthenticated(false)
        localStorage.removeItem(lsRefreshToken)
        localStorage.removeItem(lsAccessToken)
        navigate(routeNames.loginPage, { replace: true })
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
