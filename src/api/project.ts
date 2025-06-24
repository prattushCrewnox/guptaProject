import axios from "axios"
import { baseURL } from "../utils/constant"

export const fetchAllProjects = async (token: string) => {
  const res = await axios.get(  baseURL+" /getAllproject", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}
