"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart } from "lucide-react"

export default function AuthPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"patient" | "doctor">("patient")
  const router = useRouter()

  useEffect(() => {
    gsap.from(".auth-card", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" })
    gsap.from(".auth-element", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" })
  }, [])

  const handleRedirect = () => {
    const redirectPath = role === "doctor" ? "/view-appointments" : "/book-appointments"
    router.push(redirectPath)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleRedirect()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <Card className="auth-card w-full max-w-4xl mx-4 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative hidden md:block bg-gradient-to-br from-cyan-600 to-blue-700 rounded-l-xl">
              <div className="flex flex-col items-center justify-center h-full text-white p-6 space-y-6">
                <Heart className="w-16 h-16 auth-element" />
                <h2 className="text-2xl font-bold text-center auth-element">HealthConnect Pro</h2>
                <p className="text-center text-blue-100 auth-element">
                  Secure medical portal for healthcare professionals and patients
                </p>
              </div>
            </div>

            <div className="p-6">
              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid grid-cols-2 w-full auth-element">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Signup</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Label>Username</Label>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Label>Role</Label>
                    <select value={role} onChange={(e) => setRole(e.target.value as "patient" | "doctor")} className="w-full p-2 border rounded">
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                    </select>
                    <Button type="submit" className="w-full auth-element bg-blue-600 hover:bg-blue-700">
                      Proceed
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
