import { useEffect } from "react"
import { useAuthStore } from "../store/authStore"
import { fetchEngineerAssignments } from "../api/assignment"
import { useAssignmentStore } from "../store/assignmentStore"
import { EditEngineerProfile } from "../components/EditEngineerProfile"
import { AssignmentTimeline } from "../components/AssignmentTimeline" // Optional

export default function EngineerDashboard() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const { assignments, setAssignments } = useAssignmentStore()

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!token) return
      try {
        const res = await fetchEngineerAssignments(token)
        setAssignments(res)
      } catch (err) {
        console.error("Error fetching assignments:", err)
      }
    }

    fetchAssignments()
  }, [token])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>

      {/* ✅ Assignments List */}
      <div>
        <h2 className="text-xl font-semibold mb-2">My Assignments</h2>

        {assignments.length === 0 ? (
          <p>No current assignments.</p>
        ) : (
          <div className="grid gap-4">
            {assignments.map((a) => (
              <div
                key={a._id}
                className="bg-white p-4 rounded shadow border"
              >
                <h3 className="font-semibold text-lg">{a.projectId.name}</h3>
                <p className="text-sm text-gray-600">
                  Role: {a.role} | Status: {a.projectId.status}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(a.startDate).toLocaleDateString()} -{" "}
                  {new Date(a.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Allocation: {a.allocationPercentage}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

     
      <EditEngineerProfile />

      
      <AssignmentTimeline />
    </div>
  )
}
