import {create } from "zustand"
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
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}))