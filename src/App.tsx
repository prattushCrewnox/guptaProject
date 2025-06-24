import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/Login"
import SignupPage from "./pages/Signup"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import ManagerDashboard from "./pages/ManagerDashboard"
import EngineerDashboard from "./pages/EngineerDashboard"
import AnalyticsDashboard from "./pages/AnalyticsDashboard"
import { Layout } from "./components/Layout"
import { useAuthStore } from "./store/authStore"

function DashboardRouter() {
  const user = useAuthStore((s) => s.user)
  return user?.role === "manager" ? <ManagerDashboard /> : <EngineerDashboard />
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

      
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardRouter />
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
    </Router>
  )
}
