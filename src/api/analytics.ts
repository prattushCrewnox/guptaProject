import axios from "axios"
import { baseURL } from "../utils/constant"
import { fetchAllEngineers } from "./engineer"
import { fetchAllProjects } from "./project"

export const getUtilizationAnalytics = async (token: string) => {
  const res = await axios.get(`${baseURL}/analytics/utilization`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}

export const computeSkillAnalytics = async (token: string) => {
  const engineers = await fetchAllEngineers(token)
  const skillMap: Record<string, number> = {}

  engineers.forEach((e) => {
    e.skills.forEach((skill: string) => {
      skillMap[skill] = (skillMap[skill] || 0) + 1
    })
  })

  return Object.entries(skillMap).map(([skill, count]) => ({ skill, count }))
}

export const computeSeniorityAnalytics = async (token: string) => {
  const engineers = await fetchAllEngineers(token)
  const count = {
    junior: 0,
    mid: 0,
    senior: 0,
  }

  engineers.forEach((e) => {
    count[e.seniority as "junior" | "mid" | "senior"]++
  })

  const data: { level: "junior" | "mid" | "senior"; count: number }[] = [
    { level: "junior", count: count.junior },
    { level: "mid", count: count.mid },
    { level: "senior", count: count.senior },
  ]

  return data
}

export const computeTeamSizeAnalytics = async (token: string) => {
  const projects = await fetchAllProjects(token)

  return projects.map((p) => ({
    name: p.name,
    teamSize: p.teamSize,
  }))
}