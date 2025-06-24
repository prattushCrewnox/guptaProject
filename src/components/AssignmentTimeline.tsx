import { useEffect } from "react"
import { useAuthStore } from "../store/authStore"
import { useTimelineStore } from "../store/timelineStore"
import { fetchEngineerTimeline } from "../api/assignment"

export const AssignmentTimeline = () => {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const { timelineAssignments, setTimelineAssignments } = useTimelineStore()

  useEffect(() => {
    const fetch = async () => {
      if (!token || !user) return
      const res = await fetchEngineerTimeline(user._id, token)
      setTimelineAssignments(res.assignments)
    }
    fetch()
  }, [token, user])

  return (
    <div className="bg-white p-4 rounded shadow border mt-6">
      <h2 className="text-lg font-semibold mb-4">Assignment Timeline</h2>

      {timelineAssignments.length === 0 ? (
        <p>No assignments available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="text-left py-2 px-4 border-b">Project</th>
                <th className="text-left py-2 px-4 border-b">Start</th>
                <th className="text-left py-2 px-4 border-b">End</th>
                <th className="text-left py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {timelineAssignments.map((a) => (
                <tr key={a._id} className="text-sm">
                  <td className="py-2 px-4 border-b">{a.projectId.name}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(a.startDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(a.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b capitalize">
                    {a.projectId.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
