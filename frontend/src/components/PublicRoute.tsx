// src/components/PublicRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  // If authenticated, redirect to home page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render the child routes
  return <Outlet />;
};
