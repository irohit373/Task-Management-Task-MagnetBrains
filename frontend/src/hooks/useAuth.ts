import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMe } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchMe());
    }
  }, [isAuthenticated, user, dispatch]);

  return { user, isAuthenticated, loading };
};