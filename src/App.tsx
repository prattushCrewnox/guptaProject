import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/Login"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import ManagerDashboard from "./pages/ManagerDashboard"
import EngineerDashboard from "./pages/EngineerDashboard"
import { useAuthStore } from "./store/authStore"

export default function App() {
  const user = useAuthStore((s) => s.user)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "manager" ? <ManagerDashboard /> : <EngineerDashboard />}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}
