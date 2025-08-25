"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, X, User, Briefcase, Clock, DollarSign } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { ParticleBackground } from "@/components/particle-background"

interface Application {
  id: string
  jobId: string
  freelancerId: string
  freelancerName: string
  appliedAt: string
  status: "pending" | "accepted" | "rejected"
  jobTitle?: string
  jobBudget?: number
}

interface Notification {
  id: string
  type: "application" | "acceptance" | "rejection"
  title: string
  message: string
  timestamp: string
  read: boolean
  applicationId?: string
  jobId?: string
}

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    loadApplications(currentUser)
    loadNotifications(currentUser)
  }, [router])

  const loadApplications = (currentUser: any) => {
    const allApplications = JSON.parse(localStorage.getItem("trusthive_applications") || "[]")
    const allJobs = JSON.parse(localStorage.getItem("trusthive_jobs") || "[]")

    if (currentUser.userType === "client") {
      // Show applications for client's jobs
      const clientJobs = allJobs.filter((job: any) => job.clientId === currentUser.id)
      const clientJobIds = clientJobs.map((job: any) => job.id)

      const clientApplications = allApplications
        .filter((app: Application) => clientJobIds.includes(app.jobId))
        .map((app: Application) => {
          const job = allJobs.find((j: any) => j.id === app.jobId)
          return {
            ...app,
            jobTitle: job?.title,
            jobBudget: job?.budget,
          }
        })

      setApplications(clientApplications)
    } else {
      // Show freelancer's applications
      const freelancerApplications = allApplications
        .filter((app: Application) => app.freelancerId === currentUser.id)
        .map((app: Application) => {
          const job = allJobs.find((j: any) => j.id === app.jobId)
          return {
            ...app,
            jobTitle: job?.title,
            jobBudget: job?.budget,
          }
        })

      setApplications(freelancerApplications)
    }
  }

  const loadNotifications = (currentUser: any) => {
    const savedNotifications = JSON.parse(localStorage.getItem(`trusthive_notifications_${currentUser.id}`) || "[]")
    setNotifications(savedNotifications)
  }

  const handleApplicationAction = (applicationId: string, action: "accept" | "reject") => {
    if (!user || user.userType !== "client") return

    // Update application status
    const allApplications = JSON.parse(localStorage.getItem("trusthive_applications") || "[]")
    const updatedApplications = allApplications.map((app: Application) =>
      app.id === applicationId ? { ...app, status: action === "accept" ? "accepted" : "rejected" } : app,
    )
    localStorage.setItem("trusthive_applications", JSON.stringify(updatedApplications))

    // Create notification for freelancer
    const application = applications.find((app) => app.id === applicationId)
    if (application) {
      const freelancerNotifications = JSON.parse(
        localStorage.getItem(`trusthive_notifications_${application.freelancerId}`) || "[]",
      )

      const newNotification: Notification = {
        id: Date.now().toString(),
        type: action === "accept" ? "acceptance" : "rejection",
        title: action === "accept" ? "Application Accepted!" : "Application Update",
        message:
          action === "accept"
            ? `Your application for "${application.jobTitle}" has been accepted!`
            : `Your application for "${application.jobTitle}" was not selected this time.`,
        timestamp: new Date().toISOString(),
        read: false,
        applicationId: applicationId,
        jobId: application.jobId,
      }

      freelancerNotifications.unshift(newNotification)
      localStorage.setItem(
        `trusthive_notifications_${application.freelancerId}`,
        JSON.stringify(freelancerNotifications),
      )
    }

    // Reload applications
    loadApplications(user)
  }

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif,
    )
    setNotifications(updatedNotifications)
    localStorage.setItem(`trusthive_notifications_${user.id}`, JSON.stringify(updatedNotifications))
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {user.userType === "client" ? "Job Applications" : "Notifications"}
            </h1>
            <p className="text-gray-300">
              {user.userType === "client"
                ? "Manage applications for your posted jobs"
                : "Stay updated with your application status"}
            </p>
          </div>

          {user.userType === "client" ? (
            <div className="space-y-6">
              {applications.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardContent className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">No applications received yet</p>
                  </CardContent>
                </Card>
              ) : (
                applications.map((application, index) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white flex items-center gap-2">
                              <User className="h-5 w-5" />
                              {application.freelancerName}
                            </CardTitle>
                            <p className="text-gray-300 mt-1">Applied for: {application.jobTitle}</p>
                          </div>
                          <Badge
                            className={
                              application.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                : application.status === "accepted"
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : "bg-red-500/20 text-red-300 border-red-500/30"
                            }
                          >
                            {application.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-300">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />₹{application.jobBudget?.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(application.appliedAt).toLocaleDateString()}
                            </span>
                          </div>

                          {application.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApplicationAction(application.id, "accept")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApplicationAction(application.id, "reject")}
                                className="border-red-500 text-red-400 hover:bg-red-500/10"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {notifications.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardContent className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">No notifications yet</p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card
                      className={`bg-white/10 backdrop-blur-lg border-white/20 cursor-pointer transition-all hover:bg-white/15 ${
                        !notification.read ? "ring-2 ring-blue-500/50" : ""
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Bell className="h-5 w-5" />
                              {notification.title}
                            </CardTitle>
                            <p className="text-gray-300 mt-1">{notification.message}</p>
                          </div>
                          {!notification.read && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">{new Date(notification.timestamp).toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
