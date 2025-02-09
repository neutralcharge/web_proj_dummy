"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear cart here if you're using localStorage or other state management
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-800">Payment Successful!</h1>
        <p className="text-gray-600">Thank you for your purchase.</p>
        <Button onClick={() => router.push("/pharmacy")}>Return to Pharmacy</Button>
      </div>
    </div>
  )
}

