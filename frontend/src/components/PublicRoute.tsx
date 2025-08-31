// src/components/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};
