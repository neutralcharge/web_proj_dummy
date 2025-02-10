"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
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
} from "lucide-react";

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
    const icons = [
      { icon: Syringe, color: "rgba(59, 130, 246, 0.1)" },
      { icon: Pill, color: "rgba(99, 102, 241, 0.1)" },
      { icon: Stethoscope, color: "rgba(139, 92, 246, 0.1)" },
      { icon: HeartPulse, color: "rgba(236, 72, 153, 0.1)" },
      { icon: Microscope, color: "rgba(14, 165, 233, 0.1)" },
      { icon: FirstAidKit, color: "rgba(239, 68, 68, 0.1)" },
      { icon: Thermometer, color: "rgba(34, 197, 94, 0.1)" },
      { icon: Activity, color: "rgba(168, 85, 247, 0.1)" },
    ];

    if (backgroundRef.current) {
      icons.forEach((iconData, index) => {
        const iconElement = document.createElement("div");
        iconElement.style.position = "absolute";
        iconElement.style.color = iconData.color;
        iconElement.style.opacity = "0.5";
        iconElement.style.left = `${Math.random() * 100}%`;
        iconElement.style.top = `${Math.random() * 100}%`;
        backgroundRef.current?.appendChild(iconElement);

        // Render the icon using React's createElement
        const IconComponent = iconData.icon;
        const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        iconSvg.setAttribute("class", "w-12 h-12");
        iconSvg.setAttribute("viewBox", "0 0 24 24");
        const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        iconPath.setAttribute("d", IconComponent({}).props.d); // Extract the path data from the icon component
        iconSvg.appendChild(iconPath);
        iconElement.appendChild(iconSvg);

        // GSAP animations
        gsap.to(iconElement, {
          y: -50,
          x: Math.sin(index) * 30,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.2,
          scrollTrigger: {
            trigger: backgroundRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(iconElement, {
          rotate: Math.random() > 0.5 ? 360 : -360,
          duration: 20 + Math.random() * 10,
          repeat: -1,
          ease: "none",
        });
      });
    }

    // Animate step indicators
    gsap.to(".step-indicator", {
      scale: 1.1,
      duration: 0.5,
      stagger: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Initial form animation
    gsap.from(".form-container", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Background gradient animation
    gsap.to("body", {
      background: `linear-gradient(45deg, #93a5cf, #e4efe9)`,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "none",
    });
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
      {/* Floating Background Elements */}
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
                {/* Form fields for Step 1 */}
              </div>
            )}

            {/* Step 2: Select Lab Tests */}
            {step === 2 && (
              <div className="form-step-2 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Lab Tests</h2>
                {/* Form fields for Step 2 */}
              </div>
            )}

            {/* Step 3: Health Information */}
            {step === 3 && (
              <div className="form-step-3 bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Health Information</h2>
                {/* Form fields for Step 3 */}
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
                {/* Review details for Step 4 */}
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
