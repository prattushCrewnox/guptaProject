import { useForm } from "react-hook-form";
import { signupUser } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "engineer" | "manager";
  skills?: string;
  seniority?: "junior" | "mid" | "senior";
  maxCapacity?: number;
}

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      role: "engineer",
      seniority: "junior"
    }
  });
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const role = watch("role");

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      const body: any = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      if (data.role === "engineer") {
        body.skills = data.skills?.split(",").map((s) => s.trim()) || [];
        body.seniority = data.seniority;
        body.maxCapacity = Number(data.maxCapacity) || 100;
      }

      await signupUser(body);
      alert("Signup successful! You can now log in.");
      navigate("/");
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Full Name"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input
                {...register("email", { required: "Email is required" })}
                placeholder="Email address"
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                placeholder="Password"
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                {...register("role", { required: true })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="engineer">Engineer</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            {role === "engineer" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills</label>
                  <input
                    {...register("skills")}
                    placeholder="e.g., React, Node.js, Python"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Comma-separated list of skills.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seniority</label>
                  <select
                    {...register("seniority")}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="junior">Junior</option>
                    <option value="mid">Mid-level</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Capacity (%)</label>
                  <input
                    {...register("maxCapacity")}
                    type="number"
                    placeholder="100"
                    defaultValue={100}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </>
            )}
          </div>

          {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{apiError}</span>
              </div>
            )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
