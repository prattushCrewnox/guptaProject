import { useEffect } from "react"
import { User, Briefcase, Calendar, Target, Activity, Clock, CheckCircle, TrendingUp, Zap, Settings, Code, Database, Globe, Cpu } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { fetchEngineerAssignments } from "../api/assignment"
import { useAssignmentStore } from "../store/assignmentStore"
import { EditEngineerProfile } from "../components/EditEngineerProfile"
import { AssignmentTimeline } from "../components/AssignmentTimeline"

// Modern Progress Ring Component
const ProgressRing = ({ percentage, size = 80, strokeWidth = 8, className = "" }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getColor = (percent) => {
    if (percent >= 90) return "#ef4444" // red-500
    if (percent >= 75) return "#f97316" // orange-500
    if (percent >= 50) return "#3b82f6" // blue-500
    return "#10b981" // emerald-500
  }

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(51 65 85 / 0.3)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 6px ${getColor(percentage)}40)`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{percentage.toFixed(0)}%</span>
      </div>
    </div>
  )
}

// Assignment Card Component
const AssignmentCard = ({ assignment }) => {
  const isActive = assignment.projectId.status === 'Active'
  const startDate = new Date(assignment.startDate)
  const endDate = new Date(assignment.endDate)
  const now = new Date()
  const isOverdue = endDate < now && assignment.projectId.status !== 'Completed'
  
  const statusColors = {
    'Active': 'from-emerald-500/20 to-green-500/20 border-emerald-500/30',
    'Planning': 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    'On Hold': 'from-orange-500/20 to-yellow-500/20 border-orange-500/30',
    'Completed': 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
  }

  const statusIcons = {
    'Active': <Activity className="h-4 w-4 text-emerald-400" />,
    'Planning': <Clock className="h-4 w-4 text-blue-400" />,
    'On Hold': <Clock className="h-4 w-4 text-orange-400" />,
    'Completed': <CheckCircle className="h-4 w-4 text-purple-400" />
  }

  return (
    <div className={`group bg-gradient-to-br ${statusColors[assignment.projectId.status] || statusColors.Planning} backdrop-blur-xl rounded-2xl p-6 border hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900/50 rounded-lg">
            <Briefcase className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              {assignment.projectId.name}
            </h3>
            <p className="text-slate-400 text-sm">{assignment.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded-full">
          {statusIcons[assignment.projectId.status]}
          <span className="text-xs font-medium text-slate-300">
            {assignment.projectId.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-900/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300">Duration</span>
          </div>
          <p className="text-sm text-white">
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </p>
        </div>
        <div className="bg-slate-900/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300">Allocation</span>
          </div>
          <p className="text-sm text-white font-bold">{assignment.allocationPercentage}%</p>
        </div>
      </div>

      {isOverdue && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 rounded-lg border border-red-500/30">
          <Clock className="h-4 w-4 text-red-400" />
          <span className="text-sm text-red-300">Overdue</span>
        </div>
      )}
    </div>
  )
}

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    emerald: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
    orange: "from-orange-500/20 to-red-500/20 border-orange-500/30",
    purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30"
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl rounded-2xl p-6 border hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-slate-300 text-xs mt-1">{subtitle}</p>}
        </div>
        <Icon className="h-8 w-8 text-cyan-400" />
      </div>
    </div>
  )
}

// Action Card Component
const ActionCard = ({ title, children, icon: Icon }) => (
  <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-lg hover:shadow-xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
        <Icon className="h-5 w-5 text-cyan-400" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
)

// Skill Badge Component
const SkillBadge = ({ skill }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-cyan-300 border border-cyan-500/20 backdrop-blur-sm hover:bg-slate-600/50 transition-colors duration-200">
    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-1.5 animate-pulse" />
    {skill}
  </span>
)

export default function EngineerDashboard() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const { assignments, setAssignments } = useAssignmentStore()

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!token) return
      try {
        const res = await fetchEngineerAssignments(token)
        setAssignments(res)
      } catch (err) {
        console.error("Error fetching assignments:", err)
      }
    }
    fetchAssignments()
  }, [token])

  // Calculate stats
  const activeAssignments = assignments.filter(a => a.projectId.status === 'Active').length
  const totalAllocation = assignments.reduce((sum, a) => sum + (a.projectId.status === 'Active' ? a.allocationPercentage : 0), 0)
  const completedAssignments = assignments.filter(a => a.projectId.status === 'Completed').length
  const upcomingDeadlines = assignments.filter(a => {
    const endDate = new Date(a.endDate)
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0 && a.projectId.status === 'Active'
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-cyan-400 font-bold text-xl">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'EN'}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Welcome back, {user?.name || 'Engineer'}
                </h1>
                <p className="text-slate-400 mt-1">Your personal command center and mission control</p>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard 
                icon={Briefcase} 
                title="Active Missions" 
                value={activeAssignments}
                subtitle="Currently deployed"
                color="blue"
              />
              <StatsCard 
                icon={Activity} 
                title="Current Load" 
                value={`${totalAllocation}%`}
                subtitle="System utilization"
                color="emerald"
              />
              <StatsCard 
                icon={CheckCircle} 
                title="Completed" 
                value={completedAssignments}
                subtitle="Missions accomplished"
                color="purple"
              />
              <StatsCard 
                icon={Clock} 
                title="Upcoming Deadlines" 
                value={upcomingDeadlines}
                subtitle="Next 7 days"
                color="orange"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <main className="xl:col-span-3 space-y-8">
              {/* Current Assignments */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-white">Mission Portfolio</h2>
                  <div className="h-px bg-gradient-to-r from-cyan-500 to-transparent flex-1 ml-4" />
                </div>

                {assignments.length === 0 ? (
                  <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
                    <div className="p-4 bg-slate-900/50 rounded-full w-fit mx-auto mb-4">
                      <Briefcase className="h-12 w-12 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Active Missions</h3>
                    <p className="text-slate-400">Your deployment queue is currently empty. New assignments will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {assignments.map((assignment) => (
                      <AssignmentCard key={assignment._id} assignment={assignment} />
                    ))}
                  </div>
                )}
              </section>

              {/* Timeline Section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-white">Mission Timeline</h2>
                  <div className="h-px bg-gradient-to-r from-purple-500 to-transparent flex-1 ml-4" />
                </div>
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                  <AssignmentTimeline />
                </div>
              </section>
            </main>

            {/* Sidebar */}
            <aside className="xl:col-span-1 space-y-6">
              {/* Capacity Overview */}
              <ActionCard title="System Status" icon={Cpu}>
                <div className="flex flex-col items-center">
                  <ProgressRing percentage={totalAllocation} />
                  <div className="mt-4 text-center">
                    <p className="text-lg font-bold text-white">{totalAllocation}% Utilized</p>
                    <p className="text-sm text-slate-400">
                      {100 - totalAllocation}% available capacity
                    </p>
                  </div>
                </div>
              </ActionCard>

              {/* Skills Overview */}
              <ActionCard title="Core Systems" icon={Code}>
                <div className="space-y-3">
                  {user?.skills && user.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <SkillBadge key={skill} skill={skill} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Database className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No systems configured</p>
                    </div>
                  )}
                </div>
              </ActionCard>

              {/* Profile Management */}
              <ActionCard title="Profile Control" icon={Settings}>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
                  <EditEngineerProfile />
                </div>
              </ActionCard>

              {/* Recent Activity */}
              <ActionCard title="Neural Feed" icon={Zap}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-300">Assignment completed successfully</p>
                      <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-300">New mission briefing received</p>
                      <p className="text-xs text-slate-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-300">System performance optimized</p>
                      <p className="text-xs text-slate-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </ActionCard>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}