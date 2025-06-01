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

function App() {
  return (
    <MantineProvider theme={mantineTheme}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>{" "}
    </MantineProvider>
  );
}

export default App;
