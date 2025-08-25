"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, MapPin, Star, Save, Camera } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { ParticleBackground } from "@/components/particle-background"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    experience: "",
    hourlyRate: "",
    availability: "full-time",
  })
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // Load saved profile data
    const savedProfile = localStorage.getItem(`trusthive_profile_${currentUser.id}`)
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile)
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        phone: profileData.phone || "",
        location: profileData.location || "",
        bio: profileData.bio || "",
        skills: profileData.skills || "",
        experience: profileData.experience || "",
        hourlyRate: profileData.hourlyRate || "",
        availability: profileData.availability || "full-time",
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        username: currentUser.username,
        email: currentUser.email,
      }))
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)

    // Save profile data to localStorage
    const profileData = {
      ...formData,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(`trusthive_profile_${user.id}`, JSON.stringify(profileData))

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSaving(false)

    // Show success message (you could add a toast here)
    alert("Profile updated successfully!")
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
            <h1 className="text-4xl font-bold text-white mb-4">Profile Settings</h1>
            <p className="text-gray-300">Manage your TrustHive profile and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white/20 hover:bg-white/30"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-white">{user.username}</CardTitle>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {user.userType === "freelancer" ? "Freelancer" : "Client"}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {formData.phone && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{formData.phone}</span>
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{formData.location}</span>
                    </div>
                  )}
                  {user.userType === "freelancer" && formData.hourlyRate && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Star className="h-4 w-4" />
                      <span className="text-sm">₹{formData.hourlyRate}/hour</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-white">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        placeholder="Mumbai, India"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-white">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  {user.userType === "freelancer" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="skills" className="text-white">
                          Skills (comma-separated)
                        </Label>
                        <Input
                          id="skills"
                          value={formData.skills}
                          onChange={(e) => handleInputChange("skills", e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          placeholder="React, Node.js, Python, Design"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="hourlyRate" className="text-white">
                            Hourly Rate (₹)
                          </Label>
                          <Input
                            id="hourlyRate"
                            type="number"
                            value={formData.hourlyRate}
                            onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                            placeholder="1500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="availability" className="text-white">
                            Availability
                          </Label>
                          <Select
                            value={formData.availability}
                            onValueChange={(value) => handleInputChange("availability", value)}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="freelance">Freelance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-white">
                          Experience
                        </Label>
                        <Textarea
                          id="experience"
                          value={formData.experience}
                          onChange={(e) => handleInputChange("experience", e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          placeholder="Describe your work experience..."
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="mr-2"
                        >
                          <Save className="h-4 w-4" />
                        </motion.div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
