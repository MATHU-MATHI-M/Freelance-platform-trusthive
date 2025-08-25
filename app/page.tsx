"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Shield, Zap, Star, Sparkles, TrendingUp, Award } from "lucide-react"
import Link from "next/link"
import { EnhancedNavbar } from "@/components/enhanced-navbar"
import { Footer } from "@/components/footer"
import { ParticleBackground } from "@/components/particle-background"
import { FloatingElements } from "@/components/floating-elements"
import { ScrollToTop } from "@/components/scroll-to-top"
import { PageTransition } from "@/components/page-transition"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 },
}

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleOnHover = {
  whileHover: { scale: 1.05, transition: { duration: 0.2 } },
  whileTap: { scale: 0.95 },
}

export default function LandingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <EnhancedNavbar />
        <ScrollToTop />

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32">
          <ParticleBackground />
          <FloatingElements />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <motion.div
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI-Powered Freelancing Platform
                  </Badge>
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                Welcome to TrustHive
              </motion.h1>

              <motion.p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed" variants={fadeInUp}>
                Connect with top freelancers and clients worldwide. Experience the future of work with AI-powered
                matching and secure escrow payments.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={fadeInUp}>
                <Link href="/signup">
                  <motion.div {...scaleOnHover}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-2xl shadow-blue-500/25"
                    >
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <motion.div {...scaleOnHover}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg bg-transparent backdrop-blur-sm"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <motion.div variants={fadeInUp} className="text-center">
                  <motion.div
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    10K+
                  </motion.div>
                  <div className="text-gray-400 text-sm">Active Users</div>
                </motion.div>
                <motion.div variants={fadeInUp} className="text-center">
                  <motion.div
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                  >
                    5K+
                  </motion.div>
                  <div className="text-gray-400 text-sm">Projects Completed</div>
                </motion.div>
                <motion.div variants={fadeInUp} className="text-center">
                  <motion.div
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                  >
                    98%
                  </motion.div>
                  <div className="text-gray-400 text-sm">Success Rate</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <motion.h2
                className="text-4xl font-bold text-white mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                Why Choose TrustHive?
              </motion.h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Experience the next generation of freelancing with cutting-edge features designed for success.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInLeft}>
                <motion.div {...scaleOnHover}>
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 h-full">
                    <CardHeader>
                      <motion.div
                        className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Zap className="h-6 w-6 text-blue-400" />
                      </motion.div>
                      <CardTitle className="text-white">AI-Powered Matching</CardTitle>
                      <CardDescription className="text-gray-400">
                        Our advanced AI connects you with the perfect freelancers or projects based on skills,
                        experience, and preferences.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <motion.div {...scaleOnHover}>
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 h-full">
                    <CardHeader>
                      <motion.div
                        className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Shield className="h-6 w-6 text-purple-400" />
                      </motion.div>
                      <CardTitle className="text-white">Secure Escrow</CardTitle>
                      <CardDescription className="text-gray-400">
                        Protected payments with our secure escrow system. Funds are released only when work is completed
                        to satisfaction.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeInRight}>
                <motion.div {...scaleOnHover}>
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 h-full">
                    <CardHeader>
                      <motion.div
                        className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Users className="h-6 w-6 text-green-400" />
                      </motion.div>
                      <CardTitle className="text-white">Global Community</CardTitle>
                      <CardDescription className="text-gray-400">
                        Join thousands of talented freelancers and innovative clients from around the world.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-900/50 relative">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-gray-400 text-lg">Simple steps to get started on your freelancing journey</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* For Clients */}
              <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInLeft}>
                <motion.div {...scaleOnHover}>
                  <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50 backdrop-blur-sm h-full">
                    <CardHeader>
                      <CardTitle className="text-2xl text-blue-300 mb-6 flex items-center">
                        <TrendingUp className="mr-3 h-6 w-6" />
                        For Clients
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { step: 1, title: "Post Your Project", desc: "Describe your project requirements and budget" },
                        { step: 2, title: "Review Proposals", desc: "Get matched with qualified freelancers" },
                        { step: 3, title: "Hire & Pay Securely", desc: "Use our secure escrow system for payments" },
                      ].map((item, index) => (
                        <motion.div
                          key={item.step}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                        >
                          <motion.div
                            className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          >
                            {item.step}
                          </motion.div>
                          <div>
                            <h4 className="text-white font-semibold">{item.title}</h4>
                            <p className="text-gray-200">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* For Freelancers */}
              <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInRight}>
                <motion.div {...scaleOnHover}>
                  <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-700/50 backdrop-blur-sm h-full">
                    <CardHeader>
                      <CardTitle className="text-2xl text-purple-300 mb-6 flex items-center">
                        <Award className="mr-3 h-6 w-6" />
                        For Freelancers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { step: 1, title: "Create Your Profile", desc: "Showcase your skills and experience" },
                        { step: 2, title: "Find Perfect Projects", desc: "Browse and apply to matching opportunities" },
                        { step: 3, title: "Deliver & Get Paid", desc: "Complete work and receive secure payments" },
                      ].map((item, index) => (
                        <motion.div
                          key={item.step}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                        >
                          <motion.div
                            className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          >
                            {item.step}
                          </motion.div>
                          <div>
                            <h4 className="text-white font-semibold">{item.title}</h4>
                            <p className="text-gray-200">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
              <p className="text-gray-400 text-lg">Join thousands of satisfied clients and freelancers</p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  name: "Sarah Johnson",
                  role: "Startup Founder",
                  avatar: "S",
                  gradient: "from-blue-500 to-purple-500",
                  text: "TrustHive's AI matching system found me the perfect developer for my project. The escrow system gave me complete peace of mind.",
                },
                {
                  name: "Mike Chen",
                  role: "Full-Stack Developer",
                  avatar: "M",
                  gradient: "from-green-500 to-blue-500",
                  text: "As a freelancer, TrustHive has connected me with amazing clients. The platform is intuitive and the payment system is reliable.",
                },
                {
                  name: "Anna Rodriguez",
                  role: "UI/UX Designer",
                  avatar: "A",
                  gradient: "from-purple-500 to-pink-500",
                  text: "The AI chatbot helped me find relevant projects quickly. TrustHive has transformed how I approach freelancing.",
                },
              ].map((testimonial, index) => (
                <motion.div key={testimonial.name} variants={fadeInUp}>
                  <motion.div {...scaleOnHover}>
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full">
                      <CardContent className="pt-6">
                        <motion.div
                          className="flex mb-4"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + i * 0.1 }}
                            >
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            </motion.div>
                          ))}
                        </motion.div>
                        <p className="text-gray-300 mb-4">{testimonial.text}</p>
                        <div className="flex items-center gap-3">
                          <motion.div
                            className={`w-10 h-10 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {testimonial.avatar}
                          </motion.div>
                          <div>
                            <p className="text-white font-semibold">{testimonial.name}</p>
                            <p className="text-gray-400 text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  )
}
