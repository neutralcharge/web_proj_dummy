"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import {
  Stethoscope,
  Pill,
  HeartPulseIcon as Heartbeat,
  AmbulanceIcon as FirstAid,
  Phone,
  Mail,
  Clock,
  Activity,
  Thermometer,
  Syringe,
  Send,
  User,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  department: string
  preferredDate: string
  urgency: string
  symptoms: string
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      })
      reset()
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
    setIsSubmitting(false)
  }

  // Background animation elements
  const floatingIcons = [
    { Icon: Stethoscope, delay: 0, size: 48 },
    { Icon: Pill, delay: 1, size: 40 },
    { Icon: Heartbeat, delay: 2, size: 44 },
    { Icon: FirstAid, delay: 3, size: 46 },
    { Icon: Thermometer, delay: 4, size: 42 },
    { Icon: Syringe, delay: 5, size: 38 },
    { Icon: Activity, delay: 6, size: 45 },
  ]

  // DNA Helix animation
  const dnaElements = Array.from({ length: 8 }, (_, i) => i)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-repeat opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M60 30H0' stroke='%230000FF' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Floating Medical Icons */}
      {floatingIcons.map(({ Icon, delay, size }, index) => (
        <motion.div
          key={index}
          className="absolute text-blue-500/10"
          initial={{ y: "100vh" }}
          animate={{
            y: ["-100vh", "100vh"],
            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            delay: delay * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      {/* DNA Helix Animation */}
      {dnaElements.map((_, index) => (
        <motion.div
          key={`dna-${index}`}
          className="absolute left-0 w-full h-2 bg-blue-200/20 rounded-full"
          initial={{ y: index * 100 }}
          animate={{
            y: [index * 100, (index + 1) * 100],
            scaleX: [1, 0.5, 1],
            x: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 8,
            delay: index * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Pulse Lines */}
      <motion.div
        className="absolute top-1/4 left-0 w-full h-[2px] bg-blue-400/20"
        animate={{
          scaleX: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="text-center text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            We're here to help with any medical inquiries or concerns
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Phone, text: "+1 (555) 123-4567", label: "Call Us" },
              { icon: Mail, text: "contact@healthbuddy.com", label: "Email Us" },
              { icon: Clock, text: "24/7 Emergency Support", label: "Available" },
            ].map(({ icon: Icon, text, label }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-50/50"
              >
                <Icon className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">{label}</h3>
                <p className="text-sm text-gray-600">{text}</p>
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <Input
                  {...register("name", { required: "Name is required" })}
                  className="w-full"
                  placeholder="Your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="w-full"
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input {...register("phone")} type="tel" className="w-full" placeholder="Your phone number" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Date</label>
                <Input {...register("preferredDate")} type="date" className="w-full" />
              </div>
            </motion.div>

            {/* Inquiry Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Inquiry Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General Inquiry</SelectItem>
                    <SelectItem value="medium">Medium - Need Assistance</SelectItem>
                    <SelectItem value="high">High - Urgent Matter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <Input
                  {...register("subject", { required: "Subject is required" })}
                  className="w-full"
                  placeholder="Brief subject of your inquiry"
                />
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <Textarea
                  {...register("message", { required: "Message is required" })}
                  className="w-full min-h-[150px]"
                  placeholder="Please provide detailed information about your inquiry..."
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="col-span-1 md:col-span-2 flex justify-center"
            >
              <Button
                type="submit"
                className="w-full md:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Heartbeat size={18} />
                    </motion.div>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={18} />
                    Send Message
                  </span>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

