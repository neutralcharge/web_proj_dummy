"use client"

import { useState } from "react"
import { gsap } from "gsap"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

gsap.registerPlugin(ScrollTrigger)

interface FormData {
  name: string
  age: string
  bloodGroup: string
  sex: string
  mobile: string
  address: string
  landmark: string
  date: string
  time: string
  alternativeTime: string
  healthIssues: string
  medications: string
  allergies: string
  selectedTests: string[]
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const labTests = {
  "Blood Tests": [
    "Complete Blood Count (CBC)",
    "Lipid Profile",
    "Blood Sugar (Glucose)",
    "Thyroid Function",
    "Liver Function",
    "Kidney Function",
  ],
  "Diabetes Tests": ["HbA1c", "Fasting Blood Sugar", "Post Prandial Blood Sugar", "Glucose Tolerance Test"],
  "Urine Tests": ["Routine Urine Analysis", "Microalbumin", "Culture and Sensitivity"],
  "Cardiac Tests": ["ECG", "Cardiac Markers", "Cholesterol Profile"],
  "Imaging Tests": ["X-Ray", "Ultrasound", "CT Scan", "MRI"],
}

export default function LabTestBooking() {
  const [step, setStep] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    bloodGroup: "",
    sex: "",
    mobile: "",
    address: "",
    landmark: "",
    date: "",
    time: "",
    alternativeTime: "",
    healthIssues: "",
    medications: "",
    allergies: "",
    selectedTests: [],
  })

  useEffect(() => {
    // Initial animation
    gsap.from(".page-title", {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })

    // Step animations
    gsap.from(".form-step", {
      opacity: 0,
      x: 100,
      duration: 0.8,
      scrollTrigger: {
        trigger: ".form-step",
        start: "top center",
      },
    })

    // Card animations
    gsap.from(".test-card", {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".test-card",
        start: "top center",
      },
    })
  }, [])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTestSelection = (test: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTests: prev.selectedTests.includes(test)
        ? prev.selectedTests.filter((t) => t !== test)
        : [...prev.selectedTests, test],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const isStepValid = () => {
    if (step === 1) {
      return formData.name && formData.age && formData.bloodGroup && formData.sex && formData.mobile && formData.address
    }
    if (step === 2) {
      return formData.selectedTests.length > 0 && formData.date && formData.time && formData.alternativeTime
    }
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <h1 className="page-title text-4xl font-bold text-center mb-8 text-gray-800">Lab Test Booking</h1>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex justify-center gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === i ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="form-step space-y-8">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Please provide your basic details for the lab test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) => handleInputChange("bloodGroup", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Sex</Label>
                    <RadioGroup
                      value={formData.sex}
                      onValueChange={(value) => handleInputChange("sex", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      value={formData.landmark}
                      onChange={(e) => handleInputChange("landmark", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Lab Tests</CardTitle>
                <CardDescription>Choose the tests you want to book</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(labTests).map(([category, tests]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="font-semibold text-lg">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tests.map((test) => (
                        <div
                          key={test}
                          className="test-card flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Checkbox
                            id={test}
                            checked={formData.selectedTests.includes(test)}
                            onCheckedChange={() => handleTestSelection(test)}
                          />
                          <Label htmlFor={test}>{test}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternativeTime">Alternative Time</Label>
                    <Input
                      id="alternativeTime"
                      type="time"
                      value={formData.alternativeTime}
                      onChange={(e) => handleInputChange("alternativeTime", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Health Information</CardTitle>
                <CardDescription>Please provide your health details to ensure accurate testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="healthIssues">Existing Health Issues</Label>
                  <Textarea
                    id="healthIssues"
                    placeholder="e.g., Diabetes, Hypertension"
                    value={formData.healthIssues}
                    onChange={(e) => handleInputChange("healthIssues", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    placeholder="List any medications you're currently taking"
                    value={formData.medications}
                    onChange={(e) => handleInputChange("medications", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    placeholder="e.g., latex, antiseptics"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={() => setStep(step + 1)} disabled={!isStepValid()}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={!isStepValid()}>
                Confirm Booking
              </Button>
            )}
          </div>
        </form>

        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Booking Confirmed!</AlertDialogTitle>
              <AlertDialogDescription>
                We will be on the way to your place at your given time. Our team will contact you shortly with further
                details.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Button onClick={() => setShowConfirmation(false)}>Close</Button>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

