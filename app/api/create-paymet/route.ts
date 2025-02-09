import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, items } = body

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
          })),
        ),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json({ error: "Error processing payment" }, { status: 500 })
  }
}

