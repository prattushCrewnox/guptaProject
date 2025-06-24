import axios from "axios"
import { baseURL } from "../utils/constant"

export const fetchAllProjects = async (token: string) => {
  const res = await axios.get(  baseURL+" /getAllproject", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const fetchProjectById = async (id: string, token: string) => {
  const res = await axios.get(`${baseURL}/getProject/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const createProject = async (data: any, token: string) => {
  const res = await axios.post(`${baseURL}/createProject`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const updateProject = async (id: string, data: any, token: string) => {
  const res = await axios.put(`${baseURL}/updateProject/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const deleteProject = async (id: string, token: string) => {
  const res = await axios.delete(`${baseURL}/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}