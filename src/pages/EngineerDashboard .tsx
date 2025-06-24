import { useForm } from "react-hook-form"
import { useAuthStore } from "../store/authStore"
import { updateEngineerProfile } from "../api/engineer"

interface FormData {
  skills: string
  seniority: string
}

export const EditEngineerProfile = () => {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const { register, handleSubmit } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    if (!token || !user) return
    try {
      const body = {
        skills: data.skills.split(",").map((s) => s.trim()),
        seniority: data.seniority,
      }
      await updateEngineerProfile(user._id, body, token)
      alert("Profile updated!")
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed")
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-4 mt-6 rounded shadow border"
    >
      <h2 className="text-lg font-semibold mb-2">Update Profile</h2>

      <input
        {...register("skills")}
        placeholder="Comma-separated skills (e.g. React, Node.js)"
        className="border p-2 rounded w-full mb-2"
      />
      <select {...register("seniority")} className="border p-2 rounded w-full mb-2">
        <option value="">Select Seniority</option>
        <option value="junior">Junior</option>
        <option value="mid">Mid</option>
        <option value="senior">Senior</option>
      </select>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  )
}
