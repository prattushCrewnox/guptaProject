import axios from "axios"

import { baseURL } from "../utils/constant"

export const fetchAllEngineers = async (token: string) => {
  const res = await axios.get(baseURL + "/getAllEngineers", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}
export const updateEngineerProfile = async (
  id: string,
  data: { skills?: string[]; seniority?: string },
  token: string
) => {
  const res = await axios.put(
    `${baseURL}/engineerProfile/${id}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return res.data
}
