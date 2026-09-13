import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import authService from '../../services/authService';
import {
  logout,
  setLoading,
  setUser,
} from '../../redux/slices/authSlice';

/**
 * Restores session from stored JWT on app load.
 */
export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      if (!token || user) return;
      dispatch(setLoading(true));
      try {
        const { data } = await authService.getMe();
        if (!cancelled) {
          dispatch(setUser(data.data.user));
        }
      } catch {
        if (!cancelled) {
          dispatch(logout());
        }
      } finally {
        if (!cancelled) {
          dispatch(setLoading(false));
        }
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, [token, user, dispatch]);

  return children;
}
