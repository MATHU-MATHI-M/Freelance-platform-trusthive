"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  DollarSign,
  Clock,
  Mail,
  Calendar,
  LogOut,
  Settings,
  Briefcase,
  Star,
  CheckCircle,
  Eye,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { ScrollToTop } from "@/components/scroll-to-top"
import { defaultJobs } from "@/lib/default-jobs"

interface Job {
  id: string
  title: string
  description: string
  budget: number
  timeline: string
  category: string
  skills: string[]
  clientId: string
  clientName: string
  createdAt: string
  status: "open" | "in-progress" | "completed"
  applications: number
  location: string
  workType: string
}

interface Application {
  id: string
  jobId: string
  freelancerId: string
  freelancerName: string
  appliedAt: string
  status: "pending" | "accepted" | "rejected"
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleOnHover = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
}

export default function FreelancerDashboard() {
  const [user, setUser] = useState<any | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [budgetFilter, setBudgetFilter] = useState("all")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState<"browse" | "applied">("browse")
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (currentUser.userType !== "freelancer") {
      router.push("/client")
      return
    }

    setUser(currentUser)
    loadJobs()
    loadApplications(currentUser.id)
  }, [router])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, categoryFilter, budgetFilter])

  const loadJobs = () => {
    const storedJobs = JSON.parse(localStorage.getItem("trusthive_jobs") || "[]")

    // If no stored jobs exist, initialize with default jobs
    if (storedJobs.length === 0) {
      localStorage.setItem("trusthive_jobs", JSON.stringify(defaultJobs))
      const openJobs = defaultJobs.filter((job) => job.status === "open")
      setJobs(openJobs)
    } else {
      // Merge stored jobs with default jobs (avoid duplicates)
      const allJobs = [...defaultJobs, ...storedJobs]
      const uniqueJobs = allJobs.filter((job, index, self) => index === self.findIndex((j) => j.id === job.id))

      // Update localStorage with merged jobs
      localStorage.setItem("trusthive_jobs", JSON.stringify(uniqueJobs))

      const openJobs = uniqueJobs.filter((job) => job.status === "open")
      setJobs(openJobs)
    }
  }

  const loadApplications = (freelancerId: string) => {
    const allApplications = JSON.parse(localStorage.getItem("trusthive_applications") || "[]")
    const userApplications = allApplications.filter((app: Application) => app.freelancerId === freelancerId)
    setApplications(userApplications)
  }

  const filterJobs = () => {
    let filtered = jobs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
          job.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((job) => job.category === categoryFilter)
    }

    // Budget filter
    if (budgetFilter !== "all") {
      filtered = filtered.filter((job) => {
        switch (budgetFilter) {
          case "under-500":
            return job.budget < 25000
          case "500-2000":
            return job.budget >= 25000 && job.budget <= 50000
          case "2000-5000":
            return job.budget >= 50000 && job.budget <= 75000
          case "over-5000":
            return job.budget > 75000
          default:
            return true
        }
      })
    }

    setFilteredJobs(filtered)
  }

  const handleApply = (job: Job) => {
    if (!user) return

    // Check if already applied
    const existingApplication = applications.find((app) => app.jobId === job.id)
    if (existingApplication) {
      setSuccess("You have already applied to this job!")
      setTimeout(() => setSuccess(""), 3000)
      return
    }

    const newApplication: Application = {
      id: Date.now().toString(),
      jobId: job.id,
      freelancerId: user.id,
      freelancerName: user.username,
      appliedAt: new Date().toISOString(),
      status: "pending",
    }

    // Save application
    const allApplications = JSON.parse(localStorage.getItem("trusthive_applications") || "[]")
    allApplications.push(newApplication)
    localStorage.setItem("trusthive_applications", JSON.stringify(allApplications))

    // Update job applications count
    const allJobs = JSON.parse(localStorage.getItem("trusthive_jobs") || "[]")
    const updatedJobs = allJobs.map((j: Job) => (j.id === job.id ? { ...j, applications: j.applications + 1 } : j))
    localStorage.setItem("trusthive_jobs", JSON.stringify(updatedJobs))

    loadJobs()
    loadApplications(user.id)
    setSuccess("Application submitted successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getAppliedJobs = () => {
    return applications
      .map((app) => {
        const job = jobs.find((j) => j.id === app.jobId)
        return job ? { ...job, applicationStatus: app.status, appliedAt: app.appliedAt } : null
      })
      .filter(Boolean)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <ScrollToTop />
        <div className="flex">
          {/* Sidebar */}
          <motion.div
            className="w-80 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 min-h-screen"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TH</span>
                </div>
                <span className="text-xl font-bold text-white">TrustHive</span>
              </Link>

              {/* User Profile */}
              <motion.div
                className="bg-gray-700/50 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{user.profile.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{user.username}</h3>
                    <p className="text-gray-400 text-sm">Freelancer</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Star className="h-4 w-4 mr-2" />
                    {user.profile.rating || 0}/5 Rating
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-purple-500/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-300">{applications.length}</div>
                  <div className="text-xs text-gray-400">Applications</div>
                </div>
                <div className="bg-green-500/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-300">
                    {applications.filter((a) => a.status === "accepted").length}
                  </div>
                  <div className="text-xs text-gray-400">Accepted</div>
                </div>
              </motion.div>

              {/* Navigation */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant={activeTab === "browse" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "browse"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                  onClick={() => setActiveTab("browse")}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Button>
                <Button
                  variant={activeTab === "applied" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "applied"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                  onClick={() => setActiveTab("applied")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  My Applications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <motion.div initial="initial" animate="animate" variants={staggerContainer}>
              {/* Header */}
              <motion.div className="mb-8" variants={fadeInUp}>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {activeTab === "browse" ? "Browse Jobs" : "My Applications"}
                </h1>
                <p className="text-gray-400">
                  {activeTab === "browse"
                    ? "Find the perfect projects that match your skills"
                    : "Track your job applications and their status"}
                </p>
              </motion.div>

              {/* Success Alert */}
              {success && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Alert className="bg-green-500/10 border-green-500/50 text-green-300">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {activeTab === "browse" && (
                <>
                  {/* Filters */}
                  <motion.div className="mb-8" variants={fadeInUp}>
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm text-gray-300">Search</label>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-gray-700/50 border-gray-600 text-white"
                                placeholder="Search jobs..."
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm text-gray-300">Category</label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="web-development">Web Development</SelectItem>
                                <SelectItem value="mobile-development">Mobile Development</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="writing">Writing</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="data-science">Data Science</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm text-gray-300">Budget (₹)</label>
                            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Budgets</SelectItem>
                                <SelectItem value="under-500">Under ₹25,000</SelectItem>
                                <SelectItem value="500-2000">₹25,000 - ₹50,000</SelectItem>
                                <SelectItem value="2000-5000">₹50,000 - ₹75,000</SelectItem>
                                <SelectItem value="over-5000">Over ₹75,000</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-end">
                            <Button
                              variant="outline"
                              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                              onClick={() => {
                                setSearchTerm("")
                                setCategoryFilter("all")
                                setBudgetFilter("all")
                              }}
                            >
                              <Filter className="h-4 w-4 mr-2" />
                              Clear Filters
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Jobs List */}
                  <motion.div variants={fadeInUp}>
                    {filteredJobs.length === 0 ? (
                      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                        <CardContent className="text-center py-12">
                          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
                          <p className="text-gray-400">Try adjusting your filters to see more opportunities</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <motion.div
                        className="grid gap-6"
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                      >
                        {filteredJobs.map((job) => {
                          const hasApplied = applications.some((app) => app.jobId === job.id)
                          return (
                            <motion.div key={job.id} variants={fadeInUp}>
                              <motion.div {...scaleOnHover}>
                                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                                  <CardHeader>
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <CardTitle className="text-white mb-2">{job.title}</CardTitle>
                                        <CardDescription className="text-gray-400 mb-4">
                                          {job.description.length > 200
                                            ? `${job.description.substring(0, 200)}...`
                                            : job.description}
                                        </CardDescription>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                          {job.skills.map((skill) => (
                                            <Badge
                                              key={skill}
                                              variant="secondary"
                                              className="bg-purple-500/20 text-purple-300"
                                            >
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                          Posted by <span className="text-white font-medium">{job.clientName}</span> •{" "}
                                          {new Date(job.createdAt).toLocaleDateString()}
                                        </div>
                                      </div>
                                      <Badge className="ml-4 bg-blue-500/20 text-blue-300">{job.category}</Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                                        <div className="flex items-center">
                                          <DollarSign className="h-4 w-4 mr-1" />₹{job.budget.toLocaleString()}
                                        </div>
                                        <div className="flex items-center">
                                          <Clock className="h-4 w-4 mr-1" />
                                          {job.timeline}
                                        </div>
                                        <div className="flex items-center">
                                          <Eye className="h-4 w-4 mr-1" />
                                          {job.applications} applications
                                        </div>
                                        <div className="flex items-center text-blue-300">
                                          📍 {job.location} • {job.workType}
                                        </div>
                                      </div>
                                      <Button
                                        onClick={() => handleApply(job)}
                                        disabled={hasApplied}
                                        className={
                                          hasApplied
                                            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                        }
                                      >
                                        {hasApplied ? "Applied" : "Apply Now"}
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    )}
                  </motion.div>
                </>
              )}

              {activeTab === "applied" && (
                <motion.div variants={fadeInUp}>
                  {applications.length === 0 ? (
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                      <CardContent className="text-center py-12">
                        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
                        <p className="text-gray-400 mb-4">Start applying to jobs to see them here</p>
                        <Button
                          onClick={() => setActiveTab("browse")}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Browse Jobs
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <motion.div className="grid gap-6" initial="initial" animate="animate" variants={staggerContainer}>
                      {getAppliedJobs().map((job: any) => (
                        <motion.div key={job.id} variants={fadeInUp}>
                          <motion.div {...scaleOnHover}>
                            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-white mb-2">{job.title}</CardTitle>
                                    <CardDescription className="text-gray-400 mb-4">
                                      {job.description.length > 150
                                        ? `${job.description.substring(0, 150)}...`
                                        : job.description}
                                    </CardDescription>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {job.skills.map((skill: string) => (
                                        <Badge
                                          key={skill}
                                          variant="secondary"
                                          className="bg-purple-500/20 text-purple-300"
                                        >
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Applied on {new Date(job.appliedAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <Badge
                                    className={`ml-4 ${
                                      job.applicationStatus === "pending"
                                        ? "bg-yellow-500/20 text-yellow-300"
                                        : job.applicationStatus === "accepted"
                                          ? "bg-green-500/20 text-green-300"
                                          : "bg-red-500/20 text-red-300"
                                    }`}
                                  >
                                    {job.applicationStatus}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                                    <div className="flex items-center">
                                      <DollarSign className="h-4 w-4 mr-1" />₹{job.budget.toLocaleString()}
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1" />
                                      {job.timeline}
                                    </div>
                                    <div className="text-gray-400">
                                      Client: <span className="text-white">{job.clientName}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
