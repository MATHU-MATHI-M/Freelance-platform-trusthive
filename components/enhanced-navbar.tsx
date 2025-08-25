"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Settings, Bell, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export function EnhancedNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setUser(getCurrentUser())
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("trusthive_current_user")
    setUser(null)
    setShowUserMenu(false)
    router.push("/")
  }

  const navItems = [
    { href: "/", label: "Home", active: pathname === "/" },
    { href: "/client", label: "For Clients", active: pathname === "/client" },
    { href: "/freelancer", label: "For Freelancers", active: pathname === "/freelancer" },
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg"
          : "bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white font-bold text-sm">TH</span>
            </motion.div>
            <span className="text-xl font-bold text-white">TrustHive</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`relative px-3 py-2 rounded-lg transition-colors ${
                    item.active ? "text-blue-400" : "text-gray-300 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {item.active && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}

            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{user.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-gray-300 text-sm">Welcome, {user.username}</span>
                </motion.button>

                {showUserMenu && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-48 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-2">
                      <Link href="/settings" onClick={() => setShowUserMenu(false)}>
                        <div className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors">
                          <Settings className="h-4 w-4" />
                          Settings
                        </div>
                      </Link>
                      <Link href="/notifications" onClick={() => setShowUserMenu(false)}>
                        <div className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors">
                          <Bell className="h-4 w-4" />
                          Notifications
                        </div>
                      </Link>
                      <div className="border-t border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700/50 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" className="text-gray-300 hover:text-white">
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Get Started
                    </Button>
                  </motion.div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-gray-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      item.active
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    }`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              ))}

              {user ? (
                <>
                  <div className="border-t border-gray-700 my-2"></div>
                  <Link href="/settings" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors rounded-lg">
                      <Settings className="h-4 w-4" />
                      Settings
                    </div>
                  </Link>
                  <Link href="/notifications" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors rounded-lg">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700/50 transition-colors rounded-lg w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <motion.div
                      className="text-gray-300 hover:text-white transition-colors px-3 py-2"
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign In
                    </motion.div>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
