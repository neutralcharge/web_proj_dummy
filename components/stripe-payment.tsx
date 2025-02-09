"use client"

import { useState } from "react"
import { Elements } from "@stripe/stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { PaymentElement, useStripe, useElements } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  clientSecret: string
}

function PaymentForm({ clientSecret }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    try {
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      })

      if (paymentError) {
        setError(paymentError.message || "An error occurred")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={!stripe || processing} className="w-full">
        {processing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  )
}

export function StripePaymentWrapper({ clientSecret }: { clientSecret: string }) {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm clientSecret={clientSecret} />
    </Elements>
  )
}

