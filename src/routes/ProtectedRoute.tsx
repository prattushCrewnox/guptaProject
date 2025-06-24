import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { JSX } from "react"

export const ProtectedRoute = ({
  children,
  role,
}: {
  children: JSX.Element
  role?: "manager" | "engineer"
}) => {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/" />
  if (role && user.role !== role) return <Navigate to="/dashboard" />
  return children
}
