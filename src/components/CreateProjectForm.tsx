import { useForm } from "react-hook-form"
import { createProject } from "../api/project"
import { useAuthStore } from "../store/authStore"
import { fetchAllProjects } from "../api/project"
import { useProjectStore } from "../store/projectStore"

interface FormData {
  name: string
  description: string
  startDate: string
  endDate: string
  teamSize: number
  requiredSkills: string
}

export const CreateProjectForm = () => {
  const { register, handleSubmit, reset, formState } = useForm<FormData>()
  const token = useAuthStore((s) => s.token)
  const setProjects = useProjectStore((s) => s.setProjects)

  const onSubmit = async (data: FormData) => {
    try {
      const projectBody = {
        ...data,
        requiredSkills: data.requiredSkills.split(",").map((s) => s.trim()),
        teamSize: Number(data.teamSize),
      }

      await createProject(projectBody, token!)
      const all = await fetchAllProjects(token!)
      setProjects(all)
      reset()
      alert("Project created!")
    } catch (err: any) {
      alert(err.response?.data?.message || "Creation failed")
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-4 rounded shadow border grid gap-4"
    >
      <h2 className="text-lg font-semibold">Create Project</h2>

      <input
        {...register("name", { required: true })}
        placeholder="Project Name"
        className="border p-2 rounded"
      />
      <textarea
        {...register("description", { required: true })}
        placeholder="Project Description"
        className="border p-2 rounded"
      />
      <input {...register("startDate", { required: true })} type="date" className="border p-2 rounded" />
      <input {...register("endDate", { required: true })} type="date" className="border p-2 rounded" />
      <input
        {...register("teamSize", { required: true })}
        type="number"
        placeholder="Team Size"
        className="border p-2 rounded"
      />
      <input
        {...register("requiredSkills", { required: true })}
        placeholder="Skills (comma-separated)"
        className="border p-2 rounded"
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Create
      </button>
    </form>
  )
}
