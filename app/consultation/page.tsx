"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeartPulse, Syringe, Pill, Activity, DNA, Pulse, CheckCircle2, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

gsap.registerPlugin(ScrollTrigger);

interface FormData {
  name: string;
  age: string;
  bloodGroup: string;
  sex: string;
  mobile: string;
  address: string;
  landmark: string;
  date: Date | undefined;
  preferredTime: string;
  alternativeTime: string;
  existingHealth: string[];
  currentMedications: string;
  allergies: string;
  selectedTests: string[];
  otherHealthIssue: string;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

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
};

export default function LabTestBooking() {
  const [step, setStep] = useState(1);
  const [showOtherHealth, setShowOtherHealth] = useState(false);
  const [otherHealth, setOtherHealth] = useState("");
  const backgroundRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

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
  });

  useEffect(() => {
    // Medical-themed floating elements
    const medicalElements = [
      { icon: HeartPulse, color: "rgba(239, 68, 68, 0.1)", size: "w-16 h-16" }, // Beating heart
      { icon: Syringe, color: "rgba(59, 130, 246, 0.1)", size: "w-12 h-12" }, // Syringe
      { icon: Pill, color: "rgba(99, 102, 241, 0.1)", size: "w-10 h-10" }, // Pills
      { icon: Activity, color: "rgba(34, 197, 94, 0.1)", size: "w-14 h-14" }, // Activity pulse
      { icon: DNA, color: "rgba(168, 85, 247, 0.1)", size: "w-20 h-20" }, // DNA strand
      { icon: Pulse, color: "rgba(236, 72, 153, 0.1)", size: "w-18 h-18" }, // Pulse line
    ];

    if (backgroundRef.current) {
      medicalElements.forEach((element, index) => {
        const iconElement = document.createElement("div");
        iconElement.style.position = "absolute";
        iconElement.style.color = element.color;
        iconElement.style.opacity = "0.7";
        iconElement.style.left = `${Math.random() * 100}%`;
        iconElement.style.top = `${Math.random() * 100}%`;
        backgroundRef.current?.appendChild(iconElement);

        // Render the icon using React's createElement
        const IconComponent = element.icon;
        const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        iconSvg.setAttribute("class", `${element.size} animate-float`);
        iconSvg.setAttribute("viewBox", "0 0 24 24");
        const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        iconPath.setAttribute("d", IconComponent({}).props.d); // Extract the path data from the icon component
        iconSvg.appendChild(iconPath);
        iconElement.appendChild(iconSvg);

        // GSAP animations for floating and rotating
        gsap.to(iconElement, {
          y: -50,
          x: Math.sin(index) * 50,
          duration: 5 + Math.random() * 5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.5,
        });

        gsap.to(iconElement, {
          rotate: Math.random() > 0.5 ? 360 : -360,
          duration: 20 + Math.random() * 10,
          repeat: -1,
          ease: "none",
        });
      });

      // Add a heart rate monitor beeping effect
      const heartRateElement = document.createElement("div");
      heartRateElement.style.position = "absolute";
      heartRateElement.style.bottom = "10%";
      heartRateElement.style.left = "50%";
      heartRateElement.style.transform = "translateX(-50%)";
      heartRateElement.style.width = "200px";
      heartRateElement.style.height = "50px";
      heartRateElement.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
      heartRateElement.style.borderRadius = "10px";
      heartRateElement.style.overflow = "hidden";
      backgroundRef.current?.appendChild(heartRateElement);

      const heartRateLine = document.createElement("div");
      heartRateLine.style.position = "absolute";
      heartRateLine.style.bottom = "0";
      heartRateLine.style.left = "0";
      heartRateLine.style.width = "100%";
      heartRateLine.style.height = "2px";
      heartRateLine.style.backgroundColor = "rgba(239, 68, 68, 0.8)";
      heartRateElement.appendChild(heartRateLine);

      // GSAP animation for heart rate beeping
      gsap.to(heartRateLine, {
        scaleX: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  const animateNextStep = (nextStep: number) => {
    gsap.to(`.form-step-${step}`, {
      scale: 0.8,
      opacity: 0,
      rotationY: 180,
      duration: 0.5,
      onComplete: () => {
        setStep(nextStep);
        gsap.fromTo(
          `.form-step-${nextStep}`,
          {
            scale: 1.2,
            opacity: 0,
            rotationY: -180,
          },
          {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            duration: 0.7,
            ease: "power3.out",
          },
        );
      },
    });

    gsap.to(`.step-indicator-${nextStep}`, {
      backgroundColor: "#3b82f6",
      scale: 1.2,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      animateNextStep(step + 1);
    } else {
      if (successRef.current) {
        gsap.to(".form-container", {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            successRef.current!.style.display = "flex";
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
            );

            // Confetti effect
            for (let i = 0; i < 100; i++) {
              const confetti = document.createElement("div");
              confetti.className = "confetti";
              confetti.style.left = `${Math.random() * 100}%`;
              confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
              successRef.current?.appendChild(confetti);

              gsap.to(confetti, {
                y: -1000,
                x: Math.random() * 1000 - 500,
                rotation: Math.random() * 360,
                duration: 2 + Math.random() * 2,
                ease: "power1.out",
                onComplete: () => confetti.remove(),
              });
            }
          },
        });
      }

      toast({
        title: "Booking Confirmed! 🎉",
        description: "We're excited to serve you. Our medical team will be at your doorstep at the scheduled time.",
        duration: 5000,
      });
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 relative overflow-hidden">
      {/* Floating Medical Background Elements */}
      <div ref={backgroundRef} className="absolute inset-0 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Step Indicators */}
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

        {/* Form Container */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="form-step-1 bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                      placeholder="Enter your age"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sex">Sex</Label>
                    <RadioGroup
                      id="sex"
                      value={formData.sex}
                      onValueChange={(value) => updateFormData("sex", value)}
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
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) => updateFormData("bloodGroup", value)}
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
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) => updateFormData("mobile", e.target.value)}
                      placeholder="Enter your mobile number"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Select Lab Tests */}
            {step === 2 && (
              <div className="form-step-2 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Lab Tests</h2>
                <div className="space-y-4">
                  {Object.entries(labTests).map(([category, tests]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-2">{category}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {tests.map((test) => (
                          <div key={test} className="flex items-center space-x-2">
                            <Checkbox
                              id={test}
                              checked={formData.selectedTests.includes(test)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateFormData("selectedTests", [...formData.selectedTests, test]);
                                } else {
                                  updateFormData(
                                    "selectedTests",
                                    formData.selectedTests.filter((t) => t !== test),
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={test}>{test}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Health Information */}
            {step === 3 && (
              <div className="form-step-3 bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Health Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="existingHealth">Existing Health Conditions</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {["Diabetes", "Hypertension", "Asthma", "Heart Disease"].map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={condition}
                            checked={formData.existingHealth.includes(condition)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData("existingHealth", [...formData.existingHealth, condition]);
                              } else {
                                updateFormData(
                                  "existingHealth",
                                  formData.existingHealth.filter((c) => c !== condition),
                                );
                              }
                            }}
                          />
                          <Label htmlFor={condition}>{condition}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="currentMedications">Current Medications</Label>
                    <Input
                      id="currentMedications"
                      value={formData.currentMedications}
                      onChange={(e) => updateFormData("currentMedications", e.target.value)}
                      placeholder="List your current medications"
                    />
                  </div>
                  <div>
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => updateFormData("allergies", e.target.value)}
                      placeholder="List any allergies"
                    />
                  </div>
                  <div>
                    <Label htmlFor="otherHealthIssue">Other Health Issues</Label>
                    <Input
                      id="otherHealthIssue"
                      value={formData.otherHealthIssue}
                      onChange={(e) => updateFormData("otherHealthIssue", e.target.value)}
                      placeholder="Describe any other health issues"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review and Confirm */}
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
                <div className="mt-6 space-y-4">
                  <div>
                    <Label>Name:</Label>
                    <p>{formData.name}</p>
                  </div>
                  <div>
                    <Label>Age:</Label>
                    <p>{formData.age}</p>
                  </div>
                  <div>
                    <Label>Sex:</Label>
                    <p>{formData.sex}</p>
                  </div>
                  <div>
                    <Label>Blood Group:</Label>
                    <p>{formData.bloodGroup}</p>
                  </div>
                  <div>
                    <Label>Selected Tests:</Label>
                    <p>{formData.selectedTests.join(", ")}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
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

        {/* Success Message */}
        <div ref={successRef} className="hidden fixed inset-0 bg-black bg-opacity-50 justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              We're excited to serve you. Our medical team will be at your doorstep at the scheduled time.
            </p>
            <Button
              onClick={() => {
                gsap.to(successRef.current, {
                  scale: 0.8,
                  opacity: 0,
                  duration: 0.5,
                  onComplete: () => {
                    if (successRef.current) {
                      successRef.current.style.display = "none";
                    }
                  },
                });
              }}
              className="transform hover:scale-105 transition-transform"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
