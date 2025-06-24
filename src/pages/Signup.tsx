import { useForm } from "react-hook-form"
import { signupUser } from "../api/auth"
import { useNavigate } from "react-router-dom"

interface FormData {
  name: string
  email: string
  password: string
  role: "engineer" | "manager"
  skills?: string
  seniority?: "junior" | "mid" | "senior"
  maxCapacity?: number
  department?: string
}

export default function SignupPage() {
  const { register, handleSubmit } = useForm<FormData>()
  const navigate = useNavigate()

  const onSubmit = async (data: FormData) => {
    try {
      const body = {
        ...data,
        skills: data.skills?.split(",").map((s) => s.trim()),
        maxCapacity: Number(data.maxCapacity),
      }
      await signupUser(body)
      alert("Signup successful! You can now log in.")
      navigate("/")
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed")
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow w-full max-w-md space-y-3"
      >
        <h2 className="text-2xl font-bold mb-2">Sign Up</h2>

        <input {...register("name", { required: true })} placeholder="Name" className="border p-2 w-full rounded" />
        <input {...register("email", { required: true })} placeholder="Email" type="email" className="border p-2 w-full rounded" />
        <input {...register("password", { required: true })} placeholder="Password" type="password" className="border p-2 w-full rounded" />

        <select {...register("role", { required: true })} className="border p-2 w-full rounded">
          <option value="">Select Role</option>
          <option value="engineer">Engineer</option>
          <option value="manager">Manager</option>
        </select>

        <input {...register("skills")} placeholder="Skills (comma separated)" className="border p-2 w-full rounded" />
        <select {...register("seniority")} className="border p-2 w-full rounded">
          <option value="">Select Seniority</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>

        <input {...register("maxCapacity")} placeholder="Max Capacity (e.g. 100 or 50)" type="number" className="border p-2 w-full rounded" />
        <input {...register("department")} placeholder="Department" className="border p-2 w-full rounded" />

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded w-full">
          Sign Up
        </button>
      </form>
    </div>
  )
}
