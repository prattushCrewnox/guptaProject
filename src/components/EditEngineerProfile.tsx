import { useForm } from "react-hook-form"
import { useAuthStore } from "../store/authStore"
import { updateEngineerProfile } from "../api/engineer"
import { useEffect } from "react"

interface FormData {
  skills: string
  seniority: "junior" | "mid" | "senior"
}

export const EditEngineerProfile = () => {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const { register, handleSubmit, reset, formState } = useForm<FormData>({
    defaultValues: {
      skills: user?.skills?.join(", ") || "",
      seniority: user?.seniority || "junior",
    },
  })

  useEffect(() => {
    // Update form if user info loads later
    if (user) {
      reset({
        skills: user.skills?.join(", ") || "",
        seniority: user.seniority || "junior",
      })
    }
  }, [user, reset])

  const onSubmit = async (data: FormData) => {
    if (!token || !user) return
    try {
      const body = {
        skills: data.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        seniority: data.seniority,
      }
      await updateEngineerProfile(user._id, body, token)
      alert("Profile updated successfully!")
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

      <label className="block text-sm mb-1 font-medium">Skills</label>
      <input
        {...register("skills", { required: "Skills are required" })}
        placeholder="Comma-separated skills (e.g. React, Node.js)"
        className="border p-2 rounded w-full mb-2"
      />
      {formState.errors.skills && (
        <p className="text-sm text-red-600 mb-2">
          {formState.errors.skills.message}
        </p>
      )}

      <label className="block text-sm mb-1 font-medium">Seniority</label>
      <select
        {...register("seniority", { required: "Seniority is required" })}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Select...</option>
        <option value="junior">Junior</option>
        <option value="mid">Mid</option>
        <option value="senior">Senior</option>
      </select>
      {formState.errors.seniority && (
        <p className="text-sm text-red-600 mb-2">
          {formState.errors.seniority.message}
        </p>
      )}

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Save Changes
      </button>
    </form>
  )
}
