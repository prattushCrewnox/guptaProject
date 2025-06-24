import axios from "axios";
import { baseURL } from "../utils/constant";

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${baseURL}/login`, { email, password })
  return res.data
}