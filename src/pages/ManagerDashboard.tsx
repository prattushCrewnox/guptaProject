import React, { useEffect, useState } from "react";
import { Users, Cpu, Zap, Plus, TrendingUp, Activity, Clock, CheckCircle, X, Calendar, User, Briefcase, Target, FileText } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useEngineerStore, useEngineerListStore } from "../store/engineerStore";
import { useProjectStore } from "../store/projectStore";
import { getUtilizationAnalytics } from "../api/analytics";
import { fetchAllEngineers } from "../api/engineer";
import { fetchAllProjects, createProject } from "../api/project";
import { createAssignment } from "../api/assignment";

// Modern Capacity Bar Component
const ModernCapacityBar = ({ percentage, className = "" }) => {
  const getColor = (percent) => {
    if (percent >= 90) return "from-red-500 to-red-400";
    if (percent >= 75) return "from-orange-500 to-orange-400";
    if (percent >= 50) return "from-blue-500 to-blue-400";
    return "from-emerald-500 to-emerald-400";
  };

  const getShadow = (percent) => {
    if (percent >= 90) return "shadow-red-500/25";
    if (percent >= 75) return "shadow-orange-500/25";
    if (percent >= 50) return "shadow-blue-500/25";
    return "shadow-emerald-500/25";
  };

  return (
    <div className={`relative h-2 bg-slate-700/50 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full bg-gradient-to-r ${getColor(percentage)} ${getShadow(percentage)} shadow-lg transition-all duration-700 ease-out rounded-full`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Create Assignment Form Component
const CreateAssignmentForm = ({ onClose, onSubmit, engineers, projects }) => {
  const [formData, setFormData] = useState({
    engineerId: '',
    projectId: '',
    allocationPercentage: '',
    startDate: '',
    endDate: '',
    role: ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.engineerId) newErrors.engineerId = 'Engineer is required';
    if (!formData.projectId) newErrors.projectId = 'Project is required';
    if (!formData.allocationPercentage) newErrors.allocationPercentage = 'Allocation percentage is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.role) newErrors.role = 'Role is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    onSubmit && onSubmit(formData);
    onClose();
    
    // Reset form
    setFormData({
      engineerId: '',
      projectId: '',
      allocationPercentage: '',
      startDate: '',
      endDate: '',
      role: ''
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Engineer Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <User className="h-4 w-4 text-cyan-400" />
          Select Engineer
        </label>
        <select
          value={formData.engineerId}
          onChange={(e) => handleChange('engineerId', e.target.value)}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
        >
          <option value="">Choose an engineer...</option>
          {engineers.map(engineer => (
            <option key={engineer._id} value={engineer._id}>
              {engineer.name}
            </option>
          ))}
        </select>
        {errors.engineerId && (
          <p className="text-red-400 text-sm mt-1">{errors.engineerId}</p>
        )}
      </div>

      {/* Project Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <Briefcase className="h-4 w-4 text-cyan-400" />
          Select Project
        </label>
        <select
          value={formData.projectId}
          onChange={(e) => handleChange('projectId', e.target.value)}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
        >
          <option value="">Choose a project...</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
        {errors.projectId && (
          <p className="text-red-400 text-sm mt-1">{errors.projectId}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <Target className="h-4 w-4 text-cyan-400" />
          Role/Position
        </label>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          placeholder="e.g., Frontend Developer, Tech Lead..."
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
        />
        {errors.role && (
          <p className="text-red-400 text-sm mt-1">{errors.role}</p>
        )}
      </div>

      {/* Allocation Percentage */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          Allocation Percentage
        </label>
        <div className="relative">
          <input
            type="number"
            min="1"
            max="100"
            value={formData.allocationPercentage}
            onChange={(e) => handleChange('allocationPercentage', e.target.value)}
            placeholder="50"
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">%</span>
        </div>
        {errors.allocationPercentage && (
          <p className="text-red-400 text-sm mt-1">{errors.allocationPercentage}</p>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          {errors.startDate && (
            <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            End Date (Optional)
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
        >
          Deploy Assignment
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Create Project Form Component
const CreateProjectForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    requiredSkills: '',
    teamSize: '',
    status: 'Planning'
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Project name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.teamSize) newErrors.teamSize = 'Team size is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    onSubmit && onSubmit({
      ...formData,
      requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(Boolean)
    });
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      requiredSkills: '',
      teamSize: '',
      status: 'Planning'
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <Briefcase className="h-4 w-4 text-cyan-400" />
          Project Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Project Nexus"
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <FileText className="h-4 w-4 text-cyan-400" />
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the project objectives and scope..."
          rows={3}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Required Skills */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <Zap className="h-4 w-4 text-cyan-400" />
          Required Skills
        </label>
        <input
          type="text"
          value={formData.requiredSkills}
          onChange={(e) => handleChange('requiredSkills', e.target.value)}
          placeholder="React.js, Node.js, MongoDB (comma separated)"
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
        />
        <p className="text-slate-500 text-xs mt-1">Separate multiple skills with commas</p>
      </div>

      {/* Team Size and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Users className="h-4 w-4 text-cyan-400" />
            Team Size
          </label>
          <input
            type="number"
            min="1"
            value={formData.teamSize}
            onChange={(e) => handleChange('teamSize', e.target.value)}
            placeholder="5"
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          {errors.teamSize && (
            <p className="text-red-400 text-sm mt-1">{errors.teamSize}</p>
          )}
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          >
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          {errors.startDate && (
            <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            End Date (Optional)
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
        >
          Initialize Project
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const SkillTag = ({ skill }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-cyan-300 border border-cyan-500/20 backdrop-blur-sm hover:bg-slate-600/50 transition-colors duration-200">
    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-1.5 animate-pulse" />
    {skill}
  </span>
);

// Stats Card Component
// Filter Bar Component
const FilterBar = ({ masterData, onFilterChange }: { masterData: any[], onFilterChange: (filters: { skills: string, seniority: string }) => void }) => {
  const [skills, setSkills] = useState('');
  const [seniority, setSeniority] = useState('');

  const seniorityLevels = [...new Set(masterData.map(item => item.engineer.seniority))];

  useEffect(() => {
    onFilterChange({ skills, seniority });
  }, [skills, seniority, onFilterChange]);

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-slate-700/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-2 md:mb-0">Filter Engineers</h3>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Filter by skills (e.g., React,Node)..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          <select
            value={seniority}
            onChange={(e) => setSeniority(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          >
            <option value="">All Seniority Levels</option>
            {seniorityLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    emerald: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
    orange: "from-orange-500/20 to-red-500/20 border-orange-500/30",
    purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30"
  };

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
  );
};

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
);

export default function ManagerDashboard() {
  const token = useAuthStore((s) => s.token);
  const {
    utilizationData,
    masterUtilizationData,
    setUtilizationData,
    setMasterUtilizationData,
    loading,
    setLoading,
  } = useEngineerStore();
  const { engineers, setEngineers } = useEngineerListStore();
  const { projects, setProjects } = useProjectStore();

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [filters, setFilters] = useState({ skills: '', seniority: '' });

  const fetchAllData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [util, engs, projs] = await Promise.all([
        getUtilizationAnalytics(token),
        fetchAllEngineers(token),
        fetchAllProjects(token),
      ]);
      setMasterUtilizationData(util.engineerUtilization);
      setUtilizationData(util.engineerUtilization);
      setEngineers(engs);
      setProjects(projs);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    let filteredData = [...masterUtilizationData];

    // Apply seniority filter
    if (filters.seniority) {
      filteredData = filteredData.filter(item => item.engineer.seniority === filters.seniority);
    }

    // Apply skills filter
    if (filters.skills) {
      const skillFilters = filters.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      if (skillFilters.length > 0) {
        filteredData = filteredData.filter(item =>
          skillFilters.every(skillFilter =>
            item.engineer.skills.some(s => s.toLowerCase().includes(skillFilter))
          )
        );
      }
    }

    setUtilizationData(filteredData);
  }, [filters, masterUtilizationData, setUtilizationData]);

  const handleAssignmentSubmit = async (assignmentData) => {
    if (!token) return;
    try {
      await createAssignment(assignmentData, token);
      setShowAssignmentModal(false);
      await fetchAllData(); // Refresh data
    } catch (error) {
      console.error("Failed to create assignment:", error);
    }
  };

  const handleProjectSubmit = async (projectData) => {
    if (!token) return;
    try {
      await createProject(projectData, token);
      setShowProjectModal(false);
      await fetchAllData(); // Refresh data
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const totalEngineers = utilizationData.length;
  const avgUtilization = totalEngineers > 0 ? utilizationData.reduce((acc, eng) => acc + eng.utilizationPercentage, 0) / totalEngineers : 0;
  const overUtilized = utilizationData.filter(eng => eng.utilizationPercentage >= 90).length;
  const underUtilized = utilizationData.filter(eng => eng.utilizationPercentage < 50).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl">
                <Cpu className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Engineering Command Center
                </h1>
                <p className="text-slate-400 mt-1">Real-time team orchestration and resource optimization</p>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard 
                icon={Users} 
                title="Active Engineers" 
                value={totalEngineers}
                subtitle="Full deployment"
                color="blue"
              />
              <StatsCard 
                icon={TrendingUp} 
                title="Avg Utilization" 
                value={`${avgUtilization.toFixed(0)}%`}
                subtitle="Optimal range"
                color="emerald"
              />
              <StatsCard 
                icon={Zap} 
                title="Over-Utilized" 
                value={overUtilized}
                subtitle="Requires attention"
                color="orange"
              />
              <StatsCard 
                icon={Activity} 
                title="Available Capacity" 
                value={underUtilized}
                subtitle="Ready for assignment"
                color="purple"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <main className="xl:col-span-3">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-white">Engineer Matrix</h2>
                  <div className="h-px bg-gradient-to-r from-cyan-500 to-transparent flex-1 ml-4" />
                </div>

                <FilterBar masterData={masterUtilizationData} onFilterChange={setFilters} />
                
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 animate-pulse">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3">
                            <div className="h-6 bg-slate-700 rounded w-48" />
                            <div className="h-4 bg-slate-700 rounded w-32" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-700 rounded w-24" />
                            <div className="h-2 bg-slate-700 rounded w-32" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {utilizationData.map((eng) => (
                      <div key={eng.engineer._id} className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10">
                        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                          {/* Engineer Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                                <span className="text-cyan-400 font-bold text-sm">
                                  {eng.engineer.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                                  {eng.engineer.name}
                                </h3>
                                <p className="text-slate-400 text-sm">{eng.engineer.seniority}</p>
                              </div>
                            </div>
                            
                            {/* Skills */}
                            <div className="mt-4">
                              <p className="text-sm font-medium text-slate-300 mb-2">Core Systems</p>
                              <div className="flex flex-wrap gap-2">
                                {eng.engineer.skills && eng.engineer.skills.length > 0 ? (
                                  eng.engineer.skills.map((skill) => (
                                    <SkillTag key={skill} skill={skill} />
                                  ))
                                ) : (
                                  <span className="text-sm text-slate-500">No systems configured</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Capacity Display */}
                          <div className="lg:w-80">
                            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
                              <div className="flex justify-between items-baseline mb-3">
                                <span className="text-sm font-medium text-slate-300">System Load</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-white">
                                    {eng.utilizationPercentage.toFixed(0)}%
                                  </span>
                                  <div className={`w-2 h-2 rounded-full ${
                                    eng.utilizationPercentage >= 90 ? 'bg-red-500' :
                                    eng.utilizationPercentage >= 75 ? 'bg-orange-500' :
                                    eng.utilizationPercentage >= 50 ? 'bg-blue-500' : 'bg-emerald-500'
                                  } animate-pulse`} />
                                </div>
                              </div>
                              
                              <ModernCapacityBar percentage={eng.utilizationPercentage} className="mb-3" />
                              
                              <div className="flex justify-between text-xs">
                                <span className="text-emerald-400 font-medium">
                                  {eng.availableCapacity.toFixed(0)}% available
                                </span>
                                <span className="text-slate-400">
                                  {eng.engineer.maxCapacity}% total capacity
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </main>

            {/* Sidebar */}
            <aside className="xl:col-span-1 space-y-6">
              {/* Quick Actions */}
              <ActionCard title="Mission Control" icon={Plus}>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowAssignmentModal(true)}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
                  >
                    Deploy Assignment
                  </button>
                  <button 
                    onClick={() => setShowProjectModal(true)}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-slate-600/50"
                  >
                    Initialize Project
                  </button>
                </div>
              </ActionCard>

              {/* System Status */}
              <ActionCard title="System Status" icon={Activity}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-slate-300">Active Projects</span>
                    </div>
                    <span className="text-sm font-bold text-white">-</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-400" />
                      <span className="text-sm text-slate-300">Pending Tasks</span>
                    </div>
                    <span className="text-sm font-bold text-white">-</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm text-slate-300">Efficiency</span>
                    </div>
                    <span className="text-sm font-bold text-white">-</span>
                  </div>
                </div>
              </ActionCard>

              {/* Recent Activity */}
              <ActionCard title="Neural Feed" icon={Zap}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-300">Alex Rivera assigned to Project Nexus</p>
                      <p className="text-xs text-slate-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-300">System optimization completed</p>
                      <p className="text-xs text-slate-500">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-300">Resource allocation updated</p>
                      <p className="text-xs text-slate-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </ActionCard>
            </aside>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={showAssignmentModal} 
        onClose={() => setShowAssignmentModal(false)}
        title="Deploy New Assignment"
      >
        <CreateAssignmentForm 
          onClose={() => setShowAssignmentModal(false)}
          onSubmit={handleAssignmentSubmit}
          engineers={engineers}
          projects={projects}
        />
      </Modal>

      <Modal 
        isOpen={showProjectModal} 
        onClose={() => setShowProjectModal(false)}
        title="Initialize New Project"
      >
        <CreateProjectForm 
          onClose={() => setShowProjectModal(false)}
          onSubmit={handleProjectSubmit}
        />
      </Modal>
    </div>
  );
}