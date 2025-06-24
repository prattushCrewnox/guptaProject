import axios from "axios"
import { baseURL } from "../utils/constant"

export const getAllAssignments = async (token: string) => {
  const res = await axios.get(`${baseURL}/getAllAssignment`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const createAssignment = async (data: any, token: string) => {
  const res = await axios.post(`${baseURL}/createAssignment`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const fetchEngineerAssignments = async (token: string) => {
  const res = await axios.get(baseURL+"/getAllAssignment", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const fetchEngineerTimeline = async (id: string, token: string) => {
  const res = await axios.get(
    `${baseURL}/${id}/timeline`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return res.data
}
