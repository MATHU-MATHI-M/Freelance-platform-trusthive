export interface User {
  id: string
  username: string
  email: string
  password: string
  userType: "client" | "freelancer"
  createdAt: string
  profile: {
    avatar: string
    bio: string
    skills: string[]
    rating: number
    completedProjects: number
  }
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  try {
    const user = localStorage.getItem("trusthive_current_user")
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("trusthive_current_user")
  }
}

export const updateCurrentUser = (userData: Partial<User>) => {
  if (typeof window === "undefined") return

  const currentUser = getCurrentUser()
  if (!currentUser) return

  const updatedUser = { ...currentUser, ...userData }
  localStorage.setItem("trusthive_current_user", JSON.stringify(updatedUser))

  // Also update in users array
  const users = JSON.parse(localStorage.getItem("trusthive_users") || "[]")
  const userIndex = users.findIndex((u: User) => u.id === currentUser.id)
  if (userIndex !== -1) {
    users[userIndex] = updatedUser
    localStorage.setItem("trusthive_users", JSON.stringify(users))
  }
}
