"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShoppingCart, Pill, AmbulanceIcon as FirstAid, Stethoscope } from "lucide-react"
import { toast } from "sonner"
import { loadStripe } from "@stripe/stripe-js"

// Types for our data structures
interface Medicine {
  id: string
  name: string
  description: string
  price: number
  image: string
}

interface CartItem extends Medicine {
  quantity: number
}

// Sample medicine data - replace with your actual data source
const medicineData: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol",
    description: "Pain relief and fever reduction",
    price: 5.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Amoxicillin",
    description: "Antibiotic for bacterial infections",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Ibuprofen",
    description: "Anti-inflammatory pain reliever",
    price: 7.99,
    image: "/placeholder.svg?height=200&width=200",
  },
]

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export default function PharmacyPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [medicines, setMedicines] = useState<Medicine[]>(medicineData)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Filter medicines based on search query
  useEffect(() => {
    const filtered = medicineData.filter((medicine) => 
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setMedicines(filtered)
  }, [searchQuery])

  // Add to cart function
  const addToCart = (medicine: Medicine) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === medicine.id)
      if (existingItem) {
        return prevCart.map((item) => 
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...medicine, quantity: 1 }]
    })
    toast.success(`${medicine.name} added to cart`)
  }

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Handle checkout
  const handleCheckout = async () => {
    const stripe = await stripePromise
    if (!stripe) return

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart }),
      })

      const session = await response.json()
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        toast.error("Payment failed. Please try again.")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    }
  }

  // Floating animation variants
  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Floating Medical Objects */}
      <motion.div className="fixed w-full h-full pointer-events-none z-0" initial="initial" animate="animate">
        <motion.div variants={floatingAnimation} className="absolute top-20 left-10">
          <Pill className="w-8 h-8 text-blue-400 opacity-30" />
        </motion.div>
        <motion.div variants={floatingAnimation} className="absolute top-40 right-20">
          <FirstAid className="w-8 h-8 text-red-400 opacity-30" />
        </motion.div>
        <motion.div variants={floatingAnimation} className="absolute bottom-40 left-1/4">
          <Stethoscope className="w-8 h-8 text-green-400 opacity-30" />
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Medicine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {medicines.length > 0 ? (
              medicines.map((medicine) => (
                <motion.div
                  key={medicine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={medicine.image || "/placeholder.svg"}
                    alt={medicine.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{medicine.name}</h3>
                    <p className="text-gray-600 mb-4">{medicine.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">${medicine.price.toFixed(2)}</span>
                      <button
                        onClick={() => addToCart(medicine)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500">
                  <p className="text-xl mb-2">We couldn't find any medicines matching your search.</p>
                  <p>Please try a different search term or browse our complete catalog.</p>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
              {cart.length}
            </span>
          )}
        </button>

        {/* Cart Sidebar */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="fixed inset-0 bg-black z-40"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 p-6"
              >
                <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
                {cart.length > 0 ? (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-6">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold">${totalPrice.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition-colors"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center">Your cart is empty</p>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
