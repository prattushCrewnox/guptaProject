import { create } from "zustand"

export interface Project {
  _id: string
  name: string
  description: string
  startDate: string
  endDate: string
  requiredSkills: string[]
  teamSize: number
  status: "planning" | "active" | "completed"
}

interface ProjectState {
  projects: Project[]
  setProjects: (p: Project[]) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
}))
