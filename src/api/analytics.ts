import axios from "axios"
import { baseURL } from "../utils/constant"

export const getUtilizationAnalytics = async (token: string) => {
  const res = await axios.get(`${baseURL}/analytics/utilization`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}
