import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  logout,
  setCredentials,
  setError,
  setLoading,
  setUser,
} from '../redux/slices/authSlice';
import authService from '../services/authService';

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const bootstrap = async () => {
      if (!auth.token || auth.user) return;
      dispatch(setLoading(true));
      try {
        const { data } = await authService.getMe();
        dispatch(setUser(data.data.user));
      } catch {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };
    bootstrap();
  }, [auth.token, auth.user, dispatch]);

  const login = async (payload) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const { data } = await authService.login(payload);
      dispatch(
        setCredentials({
          user: data.data.user,
          token: data.data.token,
        })
      );
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (payload) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const { data } = await authService.register(payload);
      dispatch(
        setCredentials({
          user: data.data.user,
          token: data.data.token,
        })
      );
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logoutUser = async () => {
    try {
      await authService.logout();
    } catch {
      // Client logout even if API fails
    } finally {
      dispatch(logout());
    }
  };

  return {
    ...auth,
    login,
    register,
    logoutUser,
  };
}

export default useAuth;
