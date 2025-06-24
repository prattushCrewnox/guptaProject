import axios from "axios";
import { baseURL } from "../utils/constant";

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${baseURL}/login`, { email, password })
  return res.data
}

export const signupUser = async (data: {
  name: string
  email: string
  password: string
  role: "engineer" | "manager"
  skills?: string[]
  seniority?: "junior" | "mid" | "senior"
  maxCapacity?: number
  department?: string
}) => {
  const res = await axios.post(baseURL+"/signup", data)
  return res.data
}
