import { create } from "zustand"

export interface Assignment {
  _id: string
  role: string
  startDate: string
  endDate: string
  allocationPercentage: number
  projectId: {
    name: string
    status: string
  }
}

interface AssignmentState {
  assignments: Assignment[]
  setAssignments: (a: Assignment[]) => void
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: [],
  setAssignments: (a) => set({ assignments: a }),
}))
