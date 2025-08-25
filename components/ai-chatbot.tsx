"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User, DollarSign, Clock, CheckCircle, Loader2 } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  jobs?: any[]
  showApplyButtons?: boolean
}

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

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hi! I'm your TrustHive AI assistant. I can help you find jobs, answer questions about freelancing, or assist with applications. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const user = getCurrentUser()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const searchJobs = (query: string): Job[] => {
    const allJobs = JSON.parse(localStorage.getItem("trusthive_jobs") || "[]")
    const openJobs = allJobs.filter((job: Job) => job.status === "open")

    const lowerQuery = query.toLowerCase()

    // Budget filters
    if (lowerQuery.includes("under") && (lowerQuery.includes("500") || lowerQuery.includes("5000"))) {
      const budget = lowerQuery.includes("500") ? 500 : 5000
      return openJobs.filter((job: Job) => job.budget < budget)
    }

    if (lowerQuery.includes("over") && lowerQuery.includes("5000")) {
      return openJobs.filter((job: Job) => job.budget > 5000)
    }

    // Skill-based search
    const skills = ["react", "node", "javascript", "python", "design", "writing", "marketing", "data"]
    const mentionedSkills = skills.filter((skill) => lowerQuery.includes(skill))

    if (mentionedSkills.length > 0) {
      return openJobs.filter((job: Job) =>
        mentionedSkills.some(
          (skill) =>
            job.skills.some((jobSkill) => jobSkill.toLowerCase().includes(skill)) ||
            job.title.toLowerCase().includes(skill) ||
            job.description.toLowerCase().includes(skill),
        ),
      )
    }

    // Category search
    const categories = ["web", "mobile", "design", "writing", "marketing", "data"]
    const mentionedCategory = categories.find((cat) => lowerQuery.includes(cat))

    if (mentionedCategory) {
      return openJobs.filter((job: Job) => job.category.toLowerCase().includes(mentionedCategory))
    }

    // General search
    if (lowerQuery.includes("all jobs") || lowerQuery.includes("show jobs") || lowerQuery.includes("available jobs")) {
      return openJobs.slice(0, 5) // Limit to 5 jobs for better UX
    }

    return []
  }

  const handleApplyToJob = async (jobId: string) => {
    if (!user) {
      addBotMessage("Please log in to apply for jobs.")
      return
    }

    if (user.userType !== "freelancer") {
      addBotMessage("Only freelancers can apply to jobs. Please switch to a freelancer account.")
      return
    }

    // Check if already applied
    const allApplications = JSON.parse(localStorage.getItem("trusthive_applications") || "[]")
    const existingApplication = allApplications.find((app: any) => app.jobId === jobId && app.freelancerId === user.id)

    if (existingApplication) {
      addBotMessage("You have already applied to this job!")
      return
    }

    // Create application
    const newApplication = {
      id: Date.now().toString(),
      jobId: jobId,
      freelancerId: user.id,
      freelancerName: user.username,
      appliedAt: new Date().toISOString(),
      status: "pending",
    }

    // Save application
    allApplications.push(newApplication)
    localStorage.setItem("trusthive_applications", JSON.stringify(allApplications))

    // Update job applications count
    const allJobs = JSON.parse(localStorage.getItem("trusthive_jobs") || "[]")
    const updatedJobs = allJobs.map((j: Job) => (j.id === jobId ? { ...j, applications: j.applications + 1 } : j))
    localStorage.setItem("trusthive_jobs", JSON.stringify(updatedJobs))

    const job = allJobs.find((j: Job) => j.id === jobId)
    if (job) {
      const clientNotifications = JSON.parse(localStorage.getItem(`trusthive_notifications_${job.clientId}`) || "[]")

      const newNotification = {
        id: Date.now().toString(),
        type: "application",
        title: "New Job Application!",
        message: `${user.username} has applied for your job "${job.title}"`,
        timestamp: new Date().toISOString(),
        read: false,
        applicationId: newApplication.id,
        jobId: jobId,
      }

      clientNotifications.unshift(newNotification)
      localStorage.setItem(`trusthive_notifications_${job.clientId}`, JSON.stringify(clientNotifications))
    }

    addBotMessage("Great! Your application has been submitted successfully. The client will review it soon.")
  }

  const addBotMessage = (content: string, jobs?: Job[], showApplyButtons = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content,
      timestamp: new Date(),
      jobs,
      showApplyButtons,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("AI response error:", error)

      const lowerMessage = userMessage.toLowerCase()

      if (lowerMessage.includes("how") || lowerMessage.includes("what") || lowerMessage.includes("help")) {
        return "I'm having trouble connecting right now, but I can still help you search for jobs! Try asking me to 'show all jobs' or search for specific skills like 'React developer jobs'."
      }

      if (lowerMessage.includes("apply") || lowerMessage.includes("application")) {
        return "I'm currently offline, but you can still browse and apply to jobs through the freelancer dashboard. I can help you find jobs that match your skills!"
      }

      if (lowerMessage.includes("trusthive") || lowerMessage.includes("platform")) {
        return "TrustHive is a freelancing platform that connects clients with talented freelancers. You can post jobs, browse opportunities, and manage projects all in one place. I'm currently offline but can still help you search for jobs!"
      }

      return "I'm having trouble connecting to my AI services right now, but I can still help you search for jobs! Try asking me to 'show all jobs', 'React developer jobs', or 'jobs under $2000'."
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setInputValue("")

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])

    setIsLoading(true)

    // Check if it's a job search query
    const jobs = searchJobs(userMessage)
    const lowerMessage = userMessage.toLowerCase()

    if (jobs.length > 0) {
      const isFreelancer = user?.userType === "freelancer"
      addBotMessage(
        `I found ${jobs.length} job${jobs.length > 1 ? "s" : ""} that match your criteria:`,
        jobs,
        isFreelancer,
      )
    } else if (
      lowerMessage.includes("job") ||
      lowerMessage.includes("work") ||
      lowerMessage.includes("project") ||
      lowerMessage.includes("freelanc")
    ) {
      addBotMessage(
        "I couldn't find any jobs matching your specific criteria. Try searching for:\n• 'Show me all jobs'\n• 'React developer jobs'\n• 'Jobs under $2000'\n• 'Design projects'\n• 'Writing jobs'",
      )
    } else {
      // Generate AI response for general questions
      try {
        const aiResponse = await generateAIResponse(userMessage)
        addBotMessage(aiResponse)
      } catch (error) {
        addBotMessage(
          "I'm currently having connection issues, but I can still help you with:\n\n• Finding jobs: 'show all jobs'\n• Skill-based search: 'React developer jobs'\n• Budget filters: 'jobs under $2000'\n• Category search: 'design projects'\n• Direct job applications through chat\n\nWhat would you like to search for?",
        )
      }
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-gray-900/95 border-gray-700 backdrop-blur-xl shadow-2xl h-full flex flex-col">
              <CardHeader className="pb-3 px-4 pt-4">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  TrustHive AI Assistant
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                <ScrollArea className="flex-1 px-4 min-h-0">
                  <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                              : "bg-gray-700/80 text-gray-100"
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            {message.type === "bot" ? (
                              <Bot className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                            ) : (
                              <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm whitespace-pre-line break-words leading-relaxed">
                                {message.content}
                              </p>
                            </div>
                          </div>

                          {/* Job Cards */}
                          {message.jobs && message.jobs.length > 0 && (
                            <div className="space-y-3 mt-3">
                              {message.jobs.map((job) => (
                                <motion.div
                                  key={job.id}
                                  className="bg-gray-800/80 rounded-lg p-3 border border-gray-600/50"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <h4 className="text-white font-semibold text-sm mb-1 break-words">{job.title}</h4>
                                  <p className="text-gray-300 text-xs mb-2 line-clamp-2 break-words">
                                    {job.description}
                                  </p>

                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {job.skills.slice(0, 3).map((skill: string) => (
                                      <Badge
                                        key={skill}
                                        className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                    <div className="flex items-center gap-3">
                                      <span className="flex items-center">
                                        <DollarSign className="h-3 w-3 mr-1" />₹{job.budget.toLocaleString()}
                                      </span>
                                      <span className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {job.timeline}
                                      </span>
                                    </div>
                                  </div>

                                  {message.showApplyButtons && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleApplyToJob(job.id)}
                                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs"
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Apply Now
                                    </Button>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-700/80 rounded-lg p-3 flex items-center gap-2">
                          <Bot className="h-4 w-4 text-blue-400" />
                          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                          <span className="text-gray-300 text-sm">Thinking...</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-700/50 bg-gray-900/50">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about jobs or TrustHive..."
                      className="bg-gray-700/80 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 text-sm"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-shrink-0"
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
