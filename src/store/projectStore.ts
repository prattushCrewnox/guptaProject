import { create } from "zustand"

export interface Project {
  _id: string
  name: string
  status: string
}

interface ProjectState {
  projects: Project[]
  setProjects: (p: Project[]) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
}))
