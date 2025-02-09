export interface PaymentIntent {
  clientSecret: string | null
  error?: string
}

export interface StripeCheckoutData {
  amount: number
  items: CartItem[]
}

export interface CartItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  quantity: number
}

