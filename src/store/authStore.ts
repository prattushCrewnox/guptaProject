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
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  loadUserFromToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setUser: (user, token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    set({ user, token, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, token: null, isLoading: false });
  },

  loadUserFromToken: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`${baseURL}/profile`);
      set({ user: res.data, token, isLoading: false });
    } catch (err) {
      console.error("Failed to load user:", err);
      localStorage.removeItem("token");
      set({ user: null, token: null, isLoading: false });
    }
  },
}))
