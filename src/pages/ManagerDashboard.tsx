import { useEffect } from "react"
import { useAuthStore } from "../store/authStore"
import { getUtilizationAnalytics } from "../api/analytics"
import { fetchAllEngineers } from "../api/engineer"
import { fetchAllProjects } from "../api/project"
import { useEngineerStore } from "../store/engineerStore"
import { useEngineerListStore } from "../store/engineerStore"
import { useProjectStore } from "../store/projectStore"
import { CreateAssignmentForm } from "../components/CreateAssignmentForm"
import { CapacityBar } from "../components/CapacityBar"
import { CreateProjectForm } from "../components/CreateProjectForm"
import { ProjectList } from "../components/ProjectList" // ✅ new

export default function ManagerDashboard() {
  const token = useAuthStore((s) => s.token)
  const { utilizationData, setUtilizationData, loading, setLoading } = useEngineerStore()
  const setEngineers = useEngineerListStore((s) => s.setEngineers)
  const setProjects = useProjectStore((s) => s.setProjects)

  useEffect(() => {
    const fetchAll = async () => {
      if (!token) return
      setLoading(true)
      const [util, engs, projs] = await Promise.all([
        getUtilizationAnalytics(token),
        fetchAllEngineers(token),
        fetchAllProjects(token),
      ])
      setUtilizationData(util.engineerUtilization)
      setEngineers(engs)
      setProjects(projs)
      setLoading(false)
    }

    fetchAll()
  }, [token])

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Manager Dashboard</h1>

      <CreateAssignmentForm />

     
      <CreateProjectForm />

      <ProjectList />

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Engineer Utilization</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4">
            {utilizationData.map((eng) => (
              <div
                key={eng.engineer._id}
                className="bg-white p-4 shadow rounded border"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="font-semibold text-lg">
                      {eng.engineer.name} ({eng.engineer.seniority})
                    </h2>
                    <p className="text-sm text-gray-600">
                      Skills: {eng.engineer.skills.join(", ")}
                    </p>
                  </div>
                  <p className="text-sm text-right text-gray-500">
                    {eng.utilizationPercentage.toFixed(0)}% used
                  </p>
                </div>
                <CapacityBar percentage={eng.utilizationPercentage} />
                <p className="mt-1 text-sm text-gray-500">
                  Available: {eng.availableCapacity}% | Total: {eng.engineer.maxCapacity}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
