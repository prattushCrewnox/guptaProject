import { create } from "zustand"

interface SkillData {
  skill: string
  count: number
}

interface SeniorityData {
  level: "junior" | "mid" | "senior"
  count: number
}

interface TeamSizeData {
  name: string
  teamSize: number
}

interface AnalyticsState {
  skills: SkillData[]
  seniority: SeniorityData[]
  teamSizes: TeamSizeData[]
  setSkills: (data: SkillData[]) => void
  setSeniority: (data: SeniorityData[]) => void
  setTeamSizes: (data: TeamSizeData[]) => void
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  skills: [],
  seniority: [],
  teamSizes: [],
  setSkills: (skills) => set({ skills }),
  setSeniority: (seniority) => set({ seniority }),
  setTeamSizes: (teamSizes) => set({ teamSizes }),
}))
