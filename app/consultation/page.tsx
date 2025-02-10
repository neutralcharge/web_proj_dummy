"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { 
  ChevronRight,
  CheckCircle2,
  Syringe,
  Pill,
  Stethoscope,
  HeartPulse,
  Microscope,
  FireExtinguisherIcon as FirstAidKit,
  Thermometer,
  Activity,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"

gsap.registerPlugin(ScrollTrigger)

interface FormData {
  name: string
  age: string
  bloodGroup: string
  sex: string
  mobile: string
  address: string
  landmark: string
  date: Date | undefined
  preferredTime: string
  alternativeTime: string
  existingHealth: string[]
  currentMedications: string
  allergies: string
  selectedTests: string[]
  otherHealthIssue: string
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]

const labTests = {
  "Blood Tests": [
    "Complete Blood Count (CBC)",
    "Lipid Profile",
    "Blood Sugar (Glucose)",
    "Thyroid Function Test",
    "Liver Function Test",
  ],
  "Urine Tests": ["Routine Urine Analysis", "Microalbumin Test", "Urine Culture"],
  "Cardiac Tests": ["Electrocardiogram (ECG)", "Cardiac Markers", "Cholesterol Test"],
  "Imaging Tests": ["X-Ray", "Ultrasound", "MRI Scan", "CT Scan"],
}

export default function LabTestBooking() {
  const [step, setStep] = useState(1)
  const [showOtherHealth, setShowOtherHealth] = useState(false)
  const [otherHealth, setOtherHealth] = useState("")
  const backgroundRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    bloodGroup: "",
    sex: "",
    mobile: "",
    address: "",
    landmark: "",
    date: undefined,
    preferredTime: "",
    alternativeTime: "",
    existingHealth: [],
    currentMedications: "",
    allergies: "",
    selectedTests: [],
    otherHealthIssue: "",
  })

  useEffect(() => {
    const icons = [
      { icon: Syringe, color: "rgba(59, 130, 246, 0.1)" },
      { icon: Pill, color: "rgba(99, 102, 241, 0.1)" },
      { icon: Stethoscope, color: "rgba(139, 92, 246, 0.1)" },
      { icon: HeartPulse, color: "rgba(236, 72, 153, 0.1)" },
      { icon: Microscope, color: "rgba(14, 165, 233, 0.1)" },
      { icon: FirstAidKit, color: "rgba(239, 68, 68, 0.1)" },
      { icon: Thermometer, color: "rgba(34, 197, 94, 0.1)" },
      { icon: Activity, color: "rgba(168, 85, 247, 0.1)" },
    ]

    if (backgroundRef.current) {
      icons.forEach((iconData, index) => {
        const iconElement = document.createElement("div")
        iconElement.innerHTML = `<svg class="w-12 h-12" viewBox="0 0 24 24">${iconData.icon().toString()}</svg>`
        iconElement.style.position = "absolute"
        iconElement.style.color = iconData.color
        iconElement.style.opacity = "0.5"
        iconElement.style.left = `${Math.random() * 100}%`
        iconElement.style.top = `${Math.random() * 100}%`
        backgroundRef.current?.appendChild(iconElement)

        gsap.to(iconElement, {
          y: -50,
          x: Math.sin(index) * 30,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.2,
        })

        gsap.to(iconElement, {
          rotate: Math.random() > 0.5 ? 360 : -360,
          duration: 20 + Math.random() * 10,
          repeat: -1,
          ease: "none",
        })
      })
    }

    gsap.to(".step-indicator", {
      scale: 1.1,
      duration: 0.5,
      stagger: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    })

    gsap.from(".form-container", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
  }, [])

  const animateNextStep = (nextStep: number) => {
    gsap.to(`.form-step-${step}`, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        setStep(nextStep)
        gsap.fromTo(
          `.form-step-${nextStep}`,
          {
            scale: 1.2,
            opacity: 0,
            rotateY: -10,
          },
          {
            scale: 1,
            opacity: 1,
            rotateY: 0,
            duration: 0.7,
            ease: "power3.out",
          },
        )
      },
    })

    gsap.to(`.step-indicator-${nextStep}`, {
      backgroundColor: "#3b82f6",
      scale: 1.2,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      animateNextStep(step + 1)
    } else {
      if (successRef.current) {
        gsap.to(".form-container", {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            successRef.current!.style.display = "flex"
            gsap.fromTo(
              successRef.current,
              {
                scale: 0.5,
                opacity: 0,
                y: 50,
              },
              {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "elastic.out(1, 0.5)",
              },
            )

            gsap.to(".success-icon", {
              scale: 1.2,
              rotation: 360,
              duration: 1,
              stagger: 0.2,
              ease: "power2.out",
            })
          },
        })
      }

      toast({
        title: "Booking Confirmed! 🎉",
        description: "We're excited to serve you. Our medical team will be at your doorstep at the scheduled time.",
        duration: 5000,
      })
    }
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 relative overflow-hidden">
      <div ref={backgroundRef} className="absolute inset-0 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">Lab Test Booking</h1>
          <div className="flex justify-center gap-8 mb-6">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`step-indicator step-indicator-${num} w-12 h-12 rounded-full flex items-center justify-center 
                  ${step >= num ? "bg-blue-500 text-white" : "bg-gray-200"}
                  transform hover:scale-110 transition-transform cursor-pointer
                  shadow-lg hover:shadow-xl`}
                style={{
                  transform: `perspective(1000px) rotateY(${(num - step) * 5}deg)`,
                }}
              >
                <span className="text-lg font-semibold">{num}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="form-step-1 bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Blood Group</Label>
                    <Select value={formData.bloodGroup} onValueChange={(value) => updateFormData("bloodGroup", value)}>
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

                  <div>
                    <Label>Sex</Label>
                    <RadioGroup
                      value={formData.sex}
                      onValueChange={(value) => updateFormData("sex", value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => updateFormData("mobile", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) => updateFormData("landmark", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step-2 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Lab Tests</h2>

                <div className="space-y-6">
                  {Object.entries(labTests).map(([category, tests]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-700">{category}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {tests.map((test) => (
                          <div key={test} className="flex items-start space-x-3">
                            <Checkbox
                              id={test}
                              checked={formData.selectedTests.includes(test)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateFormData("selectedTests", [...formData.selectedTests, test])
                                } else {
                                  updateFormData(
                                    "selectedTests",
                                    formData.selectedTests.filter((t) => t !== test),
                                  )
                                }
                              }}
                            />
                            <Label htmlFor={test} className="text-sm">
                              {test}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <Label>Preferred Time</Label>
                    <Select
                      value={formData.preferredTime}
                      onValueChange={(value) => updateFormData("preferredTime", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Alternative Time</Label>
                    <Select
                      value={formData.alternativeTime}
                      onValueChange={(value) => updateFormData("alternativeTime", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select alternative time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step-3 bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Health Information</h2>

                <div>
                  <Label>Existing Health Issues</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {["Diabetes", "Hypertension", "Heart Disease", "Thyroid", "Asthma", "Other"].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={
                            condition === "Other" ? showOtherHealth : formData.existingHealth.includes(condition)
                          }
                          onCheckedChange={(checked) => {
                            if (condition === "Other") {
                              setShowOtherHealth(checked as boolean)
                            } else {
                              if (checked) {
                                updateFormData("existingHealth", [...formData.existingHealth, condition])
                              } else {
                                updateFormData(
                                  "existingHealth",
                                  formData.existingHealth.filter((c) => c !== condition),
                                )
                              }
                            }
                          }}
                        />
                        <Label htmlFor={condition}>{condition}</Label>
                      </div>
                    ))}
                  </div>

                  {showOtherHealth && (
                    <div className="mt-4 animate-slide-down">
                      <Label htmlFor="otherHealth">Specify Other Health Issue</Label>
                      <Input
                        id="otherHealth"
                        value={otherHealth}
                        onChange={(e) => {
                          setOtherHealth(e.target.value)
                          updateFormData("otherHealthIssue", e.target.value)
                        }}
                        placeholder="Please specify your health condition"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="medications">Current Medications</Label>
                  <Input
                    id="medications"
                    value={formData.currentMedications}
                    onChange={(e) => updateFormData("currentMedications", e.target.value)}
                    placeholder="List any current medications"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => updateFormData("allergies", e.target.value)}
                    placeholder="List any allergies (e.g., latex, antiseptics)"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Preferred Date</Label>
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => updateFormData("date", date)}
                    className="rounded-md border mt-2"
                    disabled={(date) => date < new Date() || date > new Date(Date.now() + 12096e5)}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="form-step-4 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center space-y-4">
                  <div className="flex justify-center gap-4">
                    <CheckCircle2 className="success-icon w-16 h-16 text-green-500" />
                    <HeartPulse className="success-icon w-16 h-16 text-pink-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Almost There!</h2>
                  <p className="text-gray-600">Please review your booking details before confirming</p>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Name:</p>
                      <p className="text-gray-600">{formData.name}</p>
                    </div>
                    <div>
                      <p className="font-medium">Age:</p>
                      <p className="text-gray-600">{formData.age}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Selected Tests:</p>
                    <div className="text-gray-600">
                      {formData.selectedTests.map((test, index) => (
                        <span key={test}>
                          {test}
                          {index < formData.selectedTests.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Preferred Time:</p>
                      <p className="text-gray-600">{formData.preferredTime}</p>
                    </div>
                    <div>
                      <p className="font-medium">Alternative Time:</p>
                      <p className="text-gray-600">{formData.alternativeTime}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Address:</p>
                    <p className="text-gray-600">{formData.address}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => animateNextStep(step - 1)}
                  className="transform hover:scale-105 transition-transform"
                >
                  Back
                </Button>
              )}
              <Button type="submit" className="transform hover:scale-105 transition-transform">
                {step === 4 ? "Confirm Booking" : "Next"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        <div ref={successRef} className="hidden fixed inset-0 bg-black bg-opacity-50 justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 text-center space-y-6">
            <div className="flex justify-center gap-4">
              <CheckCircle2 className="success-icon w-20 h-20 text-green-500" />
              <HeartPulse className="success-icon w-20 h-20 text-pink-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Booking Confirmed! 🎉</h2>
            <p className="text-gray-600 text-lg">
              Thank you for choosing our services. Our professional medical team will be at your doorstep at the
              scheduled time.
            </p>
            <p className="text-blue-500 font-medium">
              We're committed to providing you with the best healthcare experience.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => window.location.reload()}
                className="transform hover:scale-105 transition-transform"
              >
                Book Another Test
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Toaster />

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
