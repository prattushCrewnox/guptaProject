import { create } from "zustand"
import axios from "axios"
import { baseURL } from "../utils/constant"

interface User {
  _id: string
  name: string
  email: string
  role: "engineer" | "manager"
  skills?: string[]
  seniority?: "junior" | "mid" | "senior"
  maxCapacity?: number
  department?: string
}

interface AuthStore {
  user: User | null
  token: string | null
  setUser: (user: User, token: string) => void
  logout: () => void
  loadUserFromToken: () => Promise<void> // ✅ Add this method
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,

  setUser: (user, token) => {
    localStorage.setItem("token", token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem("token")
    set({ user: null, token: null })
  },

  loadUserFromToken: async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const res = await axios.get(baseURL+"/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      set({ user: res.data.user, token })
    } catch (err) {
      console.error("Failed to load user:", err)
      localStorage.removeItem("token")
      set({ user: null, token: null })
    }
  },
}))
