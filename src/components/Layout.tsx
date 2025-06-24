import { Link, useLocation } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

const linksForManager = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Analytics", path: "/analytics" },
]

const linksForEngineer = [
  { label: "Dashboard", path: "/dashboard" },
]

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const navLinks = user?.role === "manager" ? linksForManager : linksForEngineer

  const handleLogout = () => {
    logout()
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {/* <aside className="w-64 bg-gray-800 text-white p-6 space-y-4 hidden md:block"> */}
        {/* <h2 className="text-xl font-bold mb-6">ERM System</h2>

        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block p-2 rounded hover:bg-gray-700 ${
              location.pathname === link.path ? "bg-gray-700" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="block mt-10 text-red-400 hover:text-red-600"
        >
          Logout
        </button>
      </aside> */}

      {/* Content */}
      <main className="flex-1 bg-gray-100  overflow-x-auto">
        {children}
      </main>
    </div>
  )
}
