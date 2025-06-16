import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./modules/landing";
import { LoginPage } from "./modules/auth";
import { UserDashboard } from "./modules/user";
import { HistoryPage } from "./modules/history";
import { AdminDashboard } from "./modules/admin";
import { MainLayout } from "./layouts/MainLayout";
import "./App.css";
import { MantineProvider } from "@mantine/core";
import { mantineTheme } from "./shared/styles/mantineTheme";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { DatesProvider } from "@mantine/dates";
import "dayjs/locale/ru";

import AnalysisPage from "./modules/analysisPage/analysisPage";
import {
  AuthRoute,
  AdminRoute,
} from "./modules/auth/components/ProtectedRoute";
import PasswordPage from "./modules/auth copy/pages/LoginPage";

function App() {
  return (
    <MantineProvider theme={mantineTheme}>
      <DatesProvider settings={{ locale: "ru", firstDayOfWeek: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/history" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/set-password" element={<PasswordPage />} />
          <Route
            element={
              <AuthRoute>
                <MainLayout />
              </AuthRoute>
            }
          >
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/analysis/:id" element={<AnalysisPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/history" replace />} />
        </Routes>
      </DatesProvider>
    </MantineProvider>
  );
}

export default App;
