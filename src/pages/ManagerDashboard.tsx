import { useEffect } from "react"
import { useAuthStore } from "../store/authStore"
import { getUtilizationAnalytics } from "../api/analytics"
import { useEngineerStore } from "../store/engineerStore"
import { CapacityBar } from "../components/CapacityBar"

export default function ManagerDashboard() {
  const token = useAuthStore((s) => s.token)
  const { utilizationData, setUtilizationData, loading, setLoading } =
    useEngineerStore()

  useEffect(() => {
    const fetchUtilization = async () => {
      if (!token) return
      try {
        setLoading(true)
        const res = await getUtilizationAnalytics(token)
        setUtilizationData(res.engineerUtilization)
      } catch (err) {
        console.error("Error fetching utilization:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUtilization()
  }, [token])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Team Overview</h1>

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
  )
}
