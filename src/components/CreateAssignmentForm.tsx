import { useForm } from "react-hook-form"
import { useAuthStore } from "../store/authStore"
import { useEngineerListStore } from "../store/engineerStore"
import { useProjectStore } from "../store/projectStore"
import { createAssignment } from "../api/assignment"

interface FormData {
  engineerId: string
  projectId: string
  allocationPercentage: number
  startDate: string
  endDate: string
  role: string
}

export const CreateAssignmentForm = () => {
  const { register, handleSubmit, reset } = useForm<FormData>()
  const token = useAuthStore((s) => s.token)
  const engineers = useEngineerListStore((s) => s.engineers)
  const projects = useProjectStore((s) => s.projects)

  const onSubmit = async (data: FormData) => {
    try {
      if (!token) return
      await createAssignment(data, token)
      alert("Assignment created!")
      reset()
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create assignment")
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded border shadow-sm grid gap-4"
    >
      <h2 className="text-lg font-semibold">Create Assignment</h2>

      <select {...register("engineerId")} className="border p-2 rounded">
        <option value="">Select Engineer</option>
        {engineers.map((eng) => (
          <option key={eng._id} value={eng._id}>
            {eng.name}
          </option>
        ))}
      </select>

      <select {...register("projectId")} className="border p-2 rounded">
        <option value="">Select Project</option>
        {projects.map((proj) => (
          <option key={proj._id} value={proj._id}>
            {proj.name}
          </option>
        ))}
      </select>

      <input
        {...register("allocationPercentage")}
        type="number"
        placeholder="Allocation (%)"
        className="border p-2 rounded"
      />

      <input
        {...register("startDate")}
        type="date"
        className="border p-2 rounded"
      />
      <input
        {...register("endDate")}
        type="date"
        className="border p-2 rounded"
      />
      <input
        {...register("role")}
        type="text"
        placeholder="Role (e.g. Developer)"
        className="border p-2 rounded"
      />

      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Create
      </button>
    </form>
  )
}
