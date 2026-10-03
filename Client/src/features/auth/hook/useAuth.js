import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsSeller,
  selectIsInitializing,
  selectAuthStatus,
  selectAuthError,
  login as loginThunk,
  register as registerThunk,
  logout as logoutThunk,
} from "@/features/auth/state/authSlice";

export default function useAuth() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isSeller = useSelector(selectIsSeller);
  const isInitializing = useSelector(selectIsInitializing);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const login = useCallback(
    (payload) => dispatch(loginThunk(payload)).unwrap(),
    [dispatch],
  );

  const register = useCallback(
    (payload) => dispatch(registerThunk(payload)).unwrap(),
    [dispatch],
  );

  const logout = useCallback(
    () => dispatch(logoutThunk()).unwrap(),
    [dispatch],
  );

  return {
    user,
    isAuthenticated,
    isSeller,
    isInitializing,
    status,
    error,
    login,
    register,
    logout,
  };
}
