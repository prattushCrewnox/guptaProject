import { useEffect } from "react"
import { useAuthStore } from "../store/authStore"
import {
  computeSkillAnalytics,
  computeSeniorityAnalytics,
  computeTeamSizeAnalytics,
} from "../api/analytics"
import { useAnalyticsStore } from "../store/analyticsStore"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#FF8042", "#00C49F"]

export default function AnalyticsDashboard() {
  const token = useAuthStore((s) => s.token)
  const {
    skills,
    seniority,
    teamSizes,
    setSkills,
    setSeniority,
    setTeamSizes,
  } = useAnalyticsStore()

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return
      const [skills, seniority, teamSizes] = await Promise.all([
        computeSkillAnalytics(token),
        computeSeniorityAnalytics(token),
        computeTeamSizeAnalytics(token),
      ])
      setSkills(skills)
      setSeniority(seniority)
      setTeamSizes(teamSizes)
    }

    fetchAnalytics()
  }, [token])

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">Team Analytics</h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">Skill Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={skills}
              dataKey="count"
              nameKey="skill"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {skills.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Seniority Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={seniority}>
            <XAxis dataKey="level" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Team Size per Project</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={teamSizes}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="teamSize" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
