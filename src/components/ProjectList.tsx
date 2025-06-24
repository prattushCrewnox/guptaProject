import { useProjectStore } from "../store/projectStore"
import { deleteProject, fetchAllProjects } from "../api/project"
import { useAuthStore } from "../store/authStore"

export const ProjectList = () => {
  const { projects, setProjects } = useProjectStore()
  const token = useAuthStore((s) => s.token)

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return
    try {
      await deleteProject(id, token!)
      const all = await fetchAllProjects(token!)
      setProjects(all)
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete")
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>
      <div className="grid gap-4">
        {projects.map((p) => (
          <div key={p._id} className="bg-white border rounded p-4 shadow">
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-700">{p.description}</p>
            <p className="text-sm text-gray-500">
              Duration: {new Date(p.startDate).toLocaleDateString()} -{" "}
              {new Date(p.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Team Size: {p.teamSize} | Status: {p.status}
            </p>
            <p className="text-sm text-gray-500">
              Required Skills: {p.requiredSkills.join(", ")}
            </p>

            <button
              className="mt-2 text-red-600 text-sm hover:underline"
              onClick={() => handleDelete(p._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
