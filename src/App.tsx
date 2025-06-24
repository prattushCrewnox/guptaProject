import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import ManagerDashboard from "./pages/ManagerDashboard";
import { LogoutButton } from "./components/LogoutButton";
import EngineerDashboard from "./pages/EngineerDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import { Layout } from "./components/Layout";
import { useAuthStore } from "./store/authStore";

function App() {
  const { user, loadUserFromToken, isLoading } = useAuthStore();

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="relative">
        {user && <LogoutButton />}
        <Routes>
          <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  {user?.role === "manager" ? <ManagerDashboard /> : <EngineerDashboard />}
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute role="manager">
                <Layout>
                  <AnalyticsDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div className="p-6 text-red-500 text-xl">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
