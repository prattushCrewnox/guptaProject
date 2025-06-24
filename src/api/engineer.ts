import axios from "axios"

import { baseURL } from "../utils/constant"

export const fetchAllEngineers = async (token: string) => {
  const res = await axios.get(baseURL + "getAllEngineers", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}
