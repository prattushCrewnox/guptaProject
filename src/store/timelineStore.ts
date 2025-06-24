import { create } from "zustand"

export interface TimelineAssignment {
  _id: string
  startDate: string
  endDate: string
  projectId: {
    name: string
    status: string
    description: string
  }
}

interface TimelineState {
  timelineAssignments: TimelineAssignment[]
  setTimelineAssignments: (t: TimelineAssignment[]) => void
}

export const useTimelineStore = create<TimelineState>((set) => ({
  timelineAssignments: [],
  setTimelineAssignments: (t) => set({ timelineAssignments: t }),
}))
