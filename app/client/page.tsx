"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Briefcase, DollarSign, Clock, Mail, Calendar, Edit, Trash2, Settings, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { ScrollToTop } from "@/components/scroll-to-top"

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

export default function ClientDashboard() {
  const [user, setUser] = useState<any | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    budget: "",
    timeline: "",
    category: "",
    skills: "",
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (currentUser.userType !== "client") {
      router.push("/freelancer")
      return
    }

    setUser(currentUser)
    loadJobs(currentUser.id)
  }, [router])

  const loadJobs = (clientId: string) => {
    const allJobs = JSON.parse(localStorage.getItem("trusthive_jobs") || "[]")
    const clientJobs = allJobs.filter((job: Job) => job.clientId === clientId)
    setJobs(clientJobs)
  }

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const newJob: Job = {
      id: Date.now().toString(),
      title: jobForm.title,
      description: jobForm.description,
      budget: Number.parseFloat(jobForm.budget),
      timeline: jobForm.timeline,
      category: jobForm.category,
      skills: jobForm.skills.split(",").map((s) => s.trim()),
      clientId: user.id,
      clientName: user.username,
      createdAt: new Date().toISOString(),
      status: "open",
      applications: 0,
    }

    const allJobs = JSON.parse(localStorage.getItem("trusthive_jobs") || "[]")

    if (editingJob) {
      // Update existing job
      const updatedJobs = allJobs.map((job: Job) => (job.id === editingJob.id ? { ...newJob, id: editingJob.id } : job))
      localStorage.setItem("trusthive_jobs", JSON.stringify(updatedJobs))
      setEditingJob(null)
      setSuccess("Job updated successfully!")
    } else {
      // Add new job
      allJobs.push(newJob)
      localStorage.setItem("trusthive_jobs", JSON.stringify(allJobs))
      setSuccess("Job posted successfully!")
    }

    loadJobs(user.id)
    setShowJobForm(false)
    resetForm()

    setTimeout(() => setSuccess(""), 3000)
  }

  const resetForm = () => {
    setJobForm({
      title: "",
      description: "",
      budget: "",
      timeline: "",
      category: "",
      skills: "",
    })
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setJobForm({
      title: job.title,
      description: job.description,
      budget: job.budget.toString(),
      timeline: job.timeline,
      category: job.category,
      skills: job.skills.join(", "),
    })
    setShowJobForm(true)
  }

  const handleDelete = (jobId: string) => {
    const allJobs = JSON.parse(localStorage.getItem("trusthive_jobs") || "[]")
    const updatedJobs = allJobs.filter((job: Job) => job.id !== jobId)
    localStorage.setItem("trusthive_jobs", JSON.stringify(updatedJobs))
    loadJobs(user?.id || "")
    setSuccess("Job deleted successfully!")
    setTimeout(() => setSuccess(""), 3000)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
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
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{user.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{user.username}</h3>
                    <p className="text-gray-400 text-sm">Client</p>
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
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-300">{jobs.length}</div>
                  <div className="text-xs text-gray-400">Posted Jobs</div>
                </div>
                <div className="bg-green-500/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-300">
                    {jobs.filter((j) => j.status === "completed").length}
                  </div>
                  <div className="text-xs text-gray-400">Completed</div>
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
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
                  onClick={() => setShowJobForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
                  onClick={() => router.push("/notifications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Applications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
                  onClick={() => router.push("/settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <motion.div initial="initial" animate="animate" variants={staggerContainer}>
              {/* Header */}
              <motion.div className="mb-8" variants={fadeInUp}>
                <h1 className="text-3xl font-bold text-white mb-2">Client Dashboard</h1>
                <p className="text-gray-400">Manage your projects and find the perfect freelancers</p>
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

              {/* Job Form */}
              {showJobForm && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">{editingJob ? "Edit Job" : "Post a New Job"}</CardTitle>
                      <CardDescription className="text-gray-400">
                        Fill in the details to {editingJob ? "update your" : "post a new"} job
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleJobSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="title" className="text-gray-300">
                              Job Title
                            </Label>
                            <Input
                              id="title"
                              value={jobForm.title}
                              onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                              className="bg-gray-700/50 border-gray-600 text-white"
                              placeholder="e.g., Build a React Website"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="category" className="text-gray-300">
                              Category
                            </Label>
                            <Select
                              value={jobForm.category}
                              onValueChange={(value) => setJobForm({ ...jobForm, category: value })}
                            >
                              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="web-development">Web Development</SelectItem>
                                <SelectItem value="mobile-development">Mobile Development</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="writing">Writing</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="data-science">Data Science</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-gray-300">
                            Job Description
                          </Label>
                          <Textarea
                            id="description"
                            value={jobForm.description}
                            onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                            className="bg-gray-700/50 border-gray-600 text-white min-h-[120px]"
                            placeholder="Describe your project requirements, goals, and expectations..."
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="budget" className="text-gray-300">
                              Budget (₹)
                            </Label>
                            <Input
                              id="budget"
                              type="number"
                              value={jobForm.budget}
                              onChange={(e) => setJobForm({ ...jobForm, budget: e.target.value })}
                              className="bg-gray-700/50 border-gray-600 text-white"
                              placeholder="e.g., 50000"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="timeline" className="text-gray-300">
                              Timeline
                            </Label>
                            <Select
                              value={jobForm.timeline}
                              onValueChange={(value) => setJobForm({ ...jobForm, timeline: value })}
                            >
                              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1-3 days">1-3 days</SelectItem>
                                <SelectItem value="1 week">1 week</SelectItem>
                                <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                                <SelectItem value="1-3 months">1-3 months</SelectItem>
                                <SelectItem value="3+ months">3+ months</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="skills" className="text-gray-300">
                            Required Skills
                          </Label>
                          <Input
                            id="skills"
                            value={jobForm.skills}
                            onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                            className="bg-gray-700/50 border-gray-600 text-white"
                            placeholder="e.g., React, Node.js, TypeScript (comma separated)"
                            required
                          />
                        </div>

                        <div className="flex gap-4">
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {editingJob ? "Update Job" : "Post Job"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowJobForm(false)
                              setEditingJob(null)
                              resetForm()
                            }}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Jobs List */}
              <motion.div variants={fadeInUp}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Your Posted Jobs</h2>
                  {!showJobForm && (
                    <Button
                      onClick={() => setShowJobForm(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Job
                    </Button>
                  )}
                </div>

                {jobs.length === 0 ? (
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="text-center py-12">
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No jobs posted yet</h3>
                      <p className="text-gray-400 mb-4">Start by posting your first job to find talented freelancers</p>
                      <Button
                        onClick={() => setShowJobForm(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Post Your First Job
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <motion.div className="grid gap-6" initial="initial" animate="animate" variants={staggerContainer}>
                    {jobs.map((job) => (
                      <motion.div key={job.id} variants={fadeInUp}>
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
                                  {job.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="bg-blue-500/20 text-blue-300">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Badge
                                className={`ml-4 ${
                                  job.status === "open"
                                    ? "bg-green-500/20 text-green-300"
                                    : job.status === "in-progress"
                                      ? "bg-yellow-500/20 text-yellow-300"
                                      : "bg-gray-500/20 text-gray-300"
                                }`}
                              >
                                {job.status}
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
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-1" />
                                  {job.applications} applications
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(job)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(job.id)}
                                  className="border-red-600 text-red-300 hover:bg-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
