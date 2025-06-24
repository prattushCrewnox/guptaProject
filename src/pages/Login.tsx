import { useForm } from "react-hook-form";
import { loginUser } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Mail, Lock, LogIn, UserPlus, Zap, Shield, Activity } from "lucide-react";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: LoginForm) => {
    setApiError(null);
    try {
      const res = await loginUser(data.email, data.password);
      setUser(res.user, res.token);
      navigate("/dashboard");
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Authentication failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm" />
          
          {/* Hero Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')"
            }}
          />
          
          {/* Hero Content */}
          <div className="relative z-10 flex flex-col justify-center p-12">
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-cyan-400" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Neural Command Center
                </h1>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Access Your
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Mission Control
                </span>
              </h2>
              
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Advanced project management and team coordination platform. 
                Monitor deployments, track performance metrics, and optimize resource allocation.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-300">Real-time Analytics</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-300">AI-Powered Insights</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-300">Secure Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-8 text-center border-b border-slate-700/50">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="h-8 w-8 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  System Access
                </h2>
                <p className="text-slate-400 mt-2">
                  Enter your credentials to continue
                </p>
                <p className="text-sm text-slate-500 mt-3">
                  Need access?{" "}
                  <Link 
                    to="/signup" 
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 hover:underline"
                  >
                    Request new account
                  </Link>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email-address"
                      {...register("email", { required: "Email is required" })}
                      type="email"
                      autoComplete="email"
                      placeholder="Email address"
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
                      id="password"
                      {...register("password", { required: "Password is required" })}
                      type="password"
                      autoComplete="current-password"
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
                    />
                    {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <div className="w-1 h-1 bg-red-400 rounded-full" />
                      {errors.password.message}
                    </p>}
                  </div>
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
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        <span>Access System</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Additional Options */}
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      className="text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                    >
                      Forgot credentials?
                    </button>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Zap className="h-3 w-3" />
                      <span className="text-xs">Secure connection</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-xs text-slate-500">
                Protected by advanced encryption and multi-layer security protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}