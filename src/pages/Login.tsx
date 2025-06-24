import {useForm} from "react-hook-form"
import { loginUser } from "../api/auth"
import { useAuthStore } from "../store/authStore"
import { Link, useNavigate } from "react-router"


interface LoginForm {
  email: string
  password: string
}


export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>()
  const setUser = useAuthStore((s) => s.setUser)

  const navigate = useNavigate()

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await loginUser(data.email, data.password)
      setUser(res.user, res.token)
     navigate("/dashboard")
      
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <label className="block mb-2">Email</label>
        <input
          {...register("email", { required: true })}
          className="border p-2 rounded w-full mb-4"
        />

        <label className="block mb-2">Password</label>
        <input
          {...register("password", { required: true })}
          type="password"
          className="border p-2 rounded w-full mb-4"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
      <p className="text-sm mt-4">
  Don’t have an account?{" "}
  <Link to="/signup" className="text-blue-600 hover:underline">
    Sign up here
  </Link>
</p>

    </div>
  )
}
