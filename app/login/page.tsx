"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Stethoscope, User, Lock } from "lucide-react"

// Temporary Auth Context Implementation
const useAuth = () => ({
  login: async (username: string, password: string) => {},
  signup: async (username: string, password: string, role: string) => {}
})

export default function AuthPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("patient")
  const { login, signup } = useAuth()
  const router = useRouter()

  useEffect(() => {
    gsap.from(".auth-card", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" })
    gsap.from(".auth-element", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" })
  }, [])

  const handleSubmit = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await login(username, password)
      } else {
        await signup(username, password, role)
      }
      router.push(role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard")
    } catch (error) {
      console.error("Auth error:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <Card className="auth-card w-full max-w-4xl mx-4 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left side - Decorative */}
            <div className="relative hidden md:block bg-gradient-to-br from-cyan-600 to-blue-700 rounded-l-xl">
              <div className="flex flex-col items-center justify-center h-full text-white p-6 space-y-6">
                <Heart className="w-16 h-16 auth-element" />
                <h2 className="text-2xl font-bold text-center auth-element">HealthBuddy Pro</h2>
                <p className="text-center text-blue-100 auth-element">
                  Connect with medical professionals and manage your health securely
                </p>
              </div>
            </div>

            {/* Right side - Auth forms */}
            <div className="p-6">
              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid grid-cols-2 w-full auth-element">
                  <TabsTrigger value="login">Medical Login</TabsTrigger>
                  <TabsTrigger value="signup">Healthcare Signup</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                    <div className="space-y-2 auth-element">
                      <Label htmlFor="login-username">Professional ID</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="login-username"
                          placeholder="Enter your medical ID"
                          className="pl-10"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 auth-element">
                      <Label htmlFor="login-password">Secure Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full auth-element bg-blue-600 hover:bg-blue-700">
                      Access Medical Portal
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                    <div className="space-y-2 auth-element">
                      <Label htmlFor="signup-username">Professional ID</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="signup-username"
                          placeholder="Create your medical ID"
                          className="pl-10"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 auth-element">
                      <Label htmlFor="signup-password">Secure Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create strong password"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 auth-element">
                      <Label>Account Type</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant={role === "patient" ? "default" : "outline"}
                          className="w-full"
                          onClick={() => setRole("patient")}
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          Patient
                        </Button>
                        <Button
                          type="button"
                          variant={role === "doctor" ? "default" : "outline"}
                          className="w-full"
                          onClick={() => setRole("doctor")}
                        >
                          <Stethoscope className="mr-2 h-4 w-4" />
                          Doctor
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full auth-element bg-blue-600 hover:bg-blue-700">
                      Register Healthcare Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
