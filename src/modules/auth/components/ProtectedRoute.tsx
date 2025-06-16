import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useWhoamiStore } from "../../../layouts/model/whoamiStore";

interface AuthRouteProps {
  children: React.ReactNode;
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { fetchUser } = useWhoamiStore();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    let mounted = true;

    if (accessToken && !user && !loading) {
      fetchUser();
    }

    return () => {
      mounted = false;
    };
  }, [accessToken, user, loading, fetchUser]);

  // Если нет токена, сразу редиректим на логин
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Пока идет загрузка, показываем индикатор загрузки
  if (loading) {
    return <div>Загрузка...</div>;
  }

  return <>{children}</>;
};

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { fetchUser } = useWhoamiStore();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    let mounted = true;

    if (accessToken && !user && !loading) {
      fetchUser();
    }

    return () => {
      mounted = false;
    };
  }, [accessToken, user, loading, fetchUser]);

  // Если нет токена, сразу редиректим на логин
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user || !user.is_superuser) {
    return <Navigate to="/history" replace />;
  }

  return <>{children}</>;
};

// Для обратной совместимости
const ProtectedRoute: React.FC<AdminRouteProps> = AdminRoute;

export default ProtectedRoute;
