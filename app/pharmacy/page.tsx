"use client"

import { useState, useRef, useMemo } from "react"
import { Search, ShoppingCart, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { StripePaymentWrapper } from "@/components/stripe-payment"
import type { CartItem } from "@/types/stripe"

// Medicine data
const medicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    description: "Pain reliever and fever reducer",
    price: 5.99,
    category: "Pain Relief",
    image: "/placeholder.svg?height=200&width=200",
  },
  // ... (keep the rest of your medicines data)
] as const

export default function PharmacyPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Animation refs
  const headerRef = useRef(null)
  const cartButtonRef = useRef(null)
  const searchRef = useRef(null)
  const medicineRefs = useRef<(HTMLDivElement | null)[]>([])

  // Optimized search
  const filteredMedicines = useMemo(() => {
    if (!searchQuery) return medicines

    const searchTerm = searchQuery.toLowerCase().trim()
    return medicines.filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(searchTerm) ||
        medicine.description.toLowerCase().includes(searchTerm) ||
        medicine.category.toLowerCase().includes(searchTerm),
    )
  }, [searchQuery])

  // Cart functions
  const addToCart = (medicine: (typeof medicines)[number]) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === medicine.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prevCart, { ...medicine, quantity: 1 }]
    })

    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart`,
      duration: 2000,
    })
  }

  const removeFromCart = (medicineId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== medicineId))
  }

  const updateQuantity = (medicineId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(medicineId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === medicineId ? { ...item, quantity: newQuantity } : item)))
  }

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Handle checkout process
  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice,
          items: cart,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setClientSecret(data.clientSecret)
      setIsCartOpen(false)
      setIsPaymentOpen(true)
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Error",
        description: "Unable to process checkout. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 ref={headerRef} className="text-3xl font-bold text-gray-800">
            Online Pharmacy
          </h1>
          <div ref={cartButtonRef}>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="w-5 h-5" />
              Cart
              {cart.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <div ref={searchRef} className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search medicines..."
              className="w-full pl-10 pr-4 py-3 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Medicine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((medicine, index) => (
            <div key={medicine.id} ref={(el) => (medicineRefs.current[index] = el)} className="opacity-100">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img
                  src={medicine.image || "/placeholder.svg"}
                  alt={medicine.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{medicine.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{medicine.description}</p>
                  <Badge variant="secondary" className="mb-2">
                    {medicine.category}
                  </Badge>
                  <p className="text-lg font-bold text-blue-600">${medicine.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => addToCart(medicine)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>

        {/* Cart Dialog */}
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Your Cart</DialogTitle>
              <DialogDescription>Review your items before checkout</DialogDescription>
            </DialogHeader>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                          <X className="w-4 h-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <Button className="w-full" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
              <DialogDescription>Enter your payment details to complete the purchase</DialogDescription>
            </DialogHeader>
            {clientSecret && <StripePaymentWrapper clientSecret={clientSecret} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

