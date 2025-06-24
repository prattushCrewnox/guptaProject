import { useForm } from "react-hook-form";
import { signupUser } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { User, Mail, Lock, Shield, Code, TrendingUp, Zap, UserPlus } from "lucide-react";

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
      alert("Registration successful! Access granted.");
      navigate("/");
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-8 text-center border-b border-slate-700/50">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UserPlus className="h-8 w-8 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              System Registration
            </h2>
            <p className="text-slate-400 mt-2">
              Initialize new user profile
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Already have access?{" "}
              <Link 
                to="/" 
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 hover:underline"
              >
                Sign in to your account
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="p-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...register("name", { required: "Name is required" })}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <div className="w-1 h-1 bg-red-400 rounded-full" />
                  {errors.name.message}
                </p>}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...register("email", { required: "Email is required" })}
                  placeholder="Email address"
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <div className="w-1 h-1 bg-red-400 rounded-full" />
                  {errors.email.message}
                </p>}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...register("password", { 
                    required: "Password is required", 
                    minLength: { value: 6, message: "Password must be at least 6 characters" } 
                  })}
                  placeholder="Password"
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <div className="w-1 h-1 bg-red-400 rounded-full" />
                  {errors.password.message}
                </p>}
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  Access Level
                </label>
                <div className="relative">
                  <select
                    {...register("role", { required: true })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="engineer">System Engineer</option>
                    <option value="manager">Operations Manager</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Engineer-specific fields */}
              {role === "engineer" && (
                <div className="space-y-4 p-4 bg-slate-900/30 rounded-xl border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-slate-300">Engineer Configuration</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Core Systems
                    </label>
                    <input
                      {...register("skills")}
                      placeholder="e.g., React, Node.js, Python, Docker"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
                    />
                    <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                      <div className="w-1 h-1 bg-slate-500 rounded-full" />
                      Comma-separated list of technical skills
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                      <TrendingUp className="h-4 w-4 text-cyan-400" />
                      Experience Level
                    </label>
                    <div className="relative">
                      <select
                        {...register("seniority")}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                      >
                        <option value="junior">Junior Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior Level</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                      <Zap className="h-4 w-4 text-cyan-400" />
                      Max System Load (%)
                    </label>
                    <input
                      {...register("maxCapacity")}
                      type="number"
                      placeholder="100"
                      defaultValue={100}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {apiError && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                  <span className="text-sm">{apiError}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-cyan-500/25 disabled:shadow-none backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Initializing...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Initialize System Access</span>
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            By registering, you agree to our neural network protocols and data processing guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}