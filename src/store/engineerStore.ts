import { create } from "zustand"

export interface EngineerUtilization {
  engineer: {
    _id: string
    name: string
    skills: string[]
    seniority: string
    maxCapacity: number
  }
  totalAllocated: number
  availableCapacity: number
  utilizationPercentage: number
  status: string
  activeAssignments: any[]
}

interface EngineerState {
  utilizationData: EngineerUtilization[];
  masterUtilizationData: EngineerUtilization[]; // To hold the unfiltered list
  loading: boolean;
  setUtilizationData: (data: EngineerUtilization[]) => void;
  setMasterUtilizationData: (data: EngineerUtilization[]) => void; // Setter for the master list
  setLoading: (value: boolean) => void;
}

export const useEngineerStore = create<EngineerState>((set) => ({
  utilizationData: [],
  masterUtilizationData: [],
  loading: false,
  setUtilizationData: (data) => set({ utilizationData: data }),
  setMasterUtilizationData: (data) => set({ masterUtilizationData: data }),
  setLoading: (value) => set({ loading: value }),
}));

interface Engineer {
  _id: string
  name: string
}

interface EngineerListState {
  engineers: Engineer[]
  setEngineers: (engs: Engineer[]) => void
}

export const useEngineerListStore = create<EngineerListState>((set) => ({
  engineers: [],
  setEngineers: (engs) => set({ engineers: engs }),
}))
