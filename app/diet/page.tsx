"use client"

import { useState } from "react"
import { Bell, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface Service {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

const services: Service[] = [
  {
    title: "Notifications",
    description: "Stay updated with your fitness progress",
    icon: <Bell className="w-6 h-6" />,
    href: "/notifications"
  },
  {
    title: "Diet Planner",
    description: "Create your personalized diet plan",
    icon: <ArrowRight className="w-6 h-6" />,
    href: "/diet"
  }
]

interface UserData {
  height: number
  weight: number
  age: number
  gender: string
  activityLevel: string
  goalWeight: number
  goal: "lose" | "gain"
  sugarLevel: number
}

interface NutritionPlan {
  calories: number
  protein: number
  carbs: number
  fats: number
  sugarLimit: number
  vitamins: {
    a: number
    c: number
    d: number
    e: number
    b12: number
  }
  minerals: {
    zinc: number
    iron: number
    calcium: number
  }
}

export default function ServicesPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    height: 0,
    weight: 0,
    age: 0,
    gender: "",
    activityLevel: "moderate",
    goalWeight: 0,
    goal: "lose",
    sugarLevel: 0,
  })
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null)
  const [showDietPlanner, setShowDietPlanner] = useState(false)

  const calculateNutrition = (data: UserData): NutritionPlan => {
    const bmr =
      data.gender === "male"
        ? 88.362 + 13.397 * data.weight + 4.799 * data.height - 5.677 * data.age
        : 447.593 + 9.247 * data.weight + 3.098 * data.height - 4.33 * data.age

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    }

    const tdee = bmr * activityMultipliers[data.activityLevel as keyof typeof activityMultipliers]
    const goalCalories = data.goal === "lose" ? tdee - 500 : tdee + 500

    const baseSugarLimit = 25
    const sugarLimit = data.sugarLevel > 100 ? baseSugarLimit * 0.7 : baseSugarLimit

    return {
      calories: Math.round(goalCalories),
      protein: Math.round((goalCalories * 0.3) / 4),
      carbs: Math.round((goalCalories * 0.45) / 4),
      fats: Math.round((goalCalories * 0.25) / 9),
      sugarLimit: Math.round(sugarLimit),
      vitamins: {
        a: 900,
        c: 90,
        d: 15,
        e: 15,
        b12: 2.4,
      },
      minerals: {
        zinc: 11,
        iron: 18,
        calcium: 1000,
      },
    }
  }

  const handleNext = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (step === 3) {
      const plan = calculateNutrition(userData)
      setNutritionPlan(plan)
    }

    setLoading(false)
    setStep((prev) => prev + 1)
  }

  if (!showDietPlanner) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Services</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
              <Button 
                className="mt-4 w-full"
                onClick={() => {
                  if (service.title === "Diet Planner") {
                    setShowDietPlanner(true)
                  }
                }}
              >
                Access Service
              </Button>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => {
            setShowDietPlanner(false)
            setStep(1)
            setNutritionPlan(null)
          }}
        >
          Back to Services
        </Button>

        {step === 1 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Let's start your health journey</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={userData.height || ""}
                    onChange={(e) => setUserData((prev) => ({ ...prev, height: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={userData.weight || ""}
                    onChange={(e) => setUserData((prev) => ({ ...prev, weight: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={userData.age || ""}
                    onChange={(e) => setUserData((prev) => ({ ...prev, age: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    className="w-full p-2 border rounded-md"
                    value={userData.gender}
                    onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="activity">Activity Level</Label>
                <select
                  id="activity"
                  className="w-full p-2 border rounded-md"
                  value={userData.activityLevel}
                  onChange={(e) => setUserData((prev) => ({ ...prev, activityLevel: e.target.value }))}
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (exercise 1-3 times/week)</option>
                  <option value="moderate">Moderate (exercise 3-5 times/week)</option>
                  <option value="active">Active (exercise 6-7 times/week)</option>
                  <option value="veryActive">Very Active (hard exercise daily)</option>
                </select>
              </div>
              <Button
                className="w-full"
                onClick={handleNext}
                disabled={loading || !userData.height || !userData.weight || !userData.age || !userData.gender}
              >
                Next
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">What's your goal?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Button
                  variant={userData.goal === "lose" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setUserData((prev) => ({ ...prev, goal: "lose" }))}
                >
                  Lose Weight
                </Button>
                <Button
                  variant={userData.goal === "gain" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setUserData((prev) => ({ ...prev, goal: "gain" }))}
                >
                  Gain Weight
                </Button>
              </div>
              <div>
                <Label htmlFor="goalWeight">Target Weight (kg)</Label>
                <Input
                  id="goalWeight"
                  type="number"
                  value={userData.goalWeight || ""}
                  onChange={(e) => setUserData((prev) => ({ ...prev, goalWeight: Number(e.target.value) }))}
                />
              </div>
              <Button className="w-full" onClick={handleNext} disabled={loading || !userData.goalWeight}>
                Next
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">One Last Step</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="sugarLevel">Blood Sugar Level (mg/dL)</Label>
                <Input
                  id="sugarLevel"
                  type="number"
                  placeholder="Enter your blood sugar level"
                  value={userData.sugarLevel || ""}
                  onChange={(e) => setUserData((prev) => ({ ...prev, sugarLevel: Number(e.target.value) }))}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Normal fasting blood sugar level is between 70-100 mg/dL
                </p>
              </div>
              <Button className="w-full" onClick={handleNext} disabled={loading || !userData.sugarLevel}>
                Generate Diet Plan
              </Button>
            </div>
          </Card>
        )}

        {step === 4 && nutritionPlan && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Personalized Nutrition Plan</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Daily Calories</h3>
                <p className="text-3xl font-bold">{nutritionPlan.calories} kcal</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <h4 className="font-medium">Protein</h4>
                  <p className="text-xl font-bold">{nutritionPlan.protein}g</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <h4 className="font-medium">Carbs</h4>
                  <p className="text-xl font-bold">{nutritionPlan.carbs}g</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <h4 className="font-medium">Fats</h4>
                  <p className="text-xl font-bold">{nutritionPlan.fats}g</p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Sugar Limit</h3>
                <p className="text-xl font-bold">{nutritionPlan.sugarLimit}g per day</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Vitamins</h3>
                  {Object.entries(nutritionPlan.vitamins).map(([vitamin, amount]) => (
                    <div key={vitamin} className="flex justify-between items-center py-1">
                      <span>Vitamin {vitamin.toUpperCase()}</span>
                      <span className="font-medium">{amount} mcg</span>
                    </div>
                  ))}
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Minerals</h3>
                  {Object.entries(nutritionPlan.minerals).map(([mineral, amount]) => (
                    <div key={mineral} className="flex justify-between items-center py-1">
                      <span className="capitalize">{mineral}</span>
                      <span className="font-medium">{amount} mg</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
