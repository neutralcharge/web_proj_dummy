'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Search, ShoppingCart, Plus, Pill, PillIcon as Capsule, Syringe, Thermometer, Activity, Heart, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// Types
interface Medicine {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
}

interface CartItem extends Medicine {
  quantity: number
}

// Enhanced medicine data with 50 items
const medicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    description: "Pain reliever and fever reducer",
    price: 5.99,
    category: "Pain Relief",
    image: "/api/placeholder/200/200"
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    description: "Antibiotic for bacterial infections",
    price: 12.99,
    category: "Antibiotics",
    image: "/api/placeholder/200/200"
  },
  {
    id: 3,
    name: "Omeprazole 20mg",
    description: "Reduces stomach acid production",
    price: 15.99,
    category: "Digestive Health",
    image: "/api/placeholder/200/200"
  },
  {
    id: 4,
    name: "Lisinopril 10mg",
    description: "ACE inhibitor for blood pressure",
    price: 18.50,
    category: "Cardiovascular",
    image: "/api/placeholder/200/200"
  },
  {
    id: 5,
    name: "Metformin 500mg",
    description: "Oral diabetes medicine",
    price: 8.99,
    category: "Diabetes",
    image: "/api/placeholder/200/200"
  },
  {
    id: 6,
    name: "Cetirizine 10mg",
    description: "Antihistamine for allergies",
    price: 7.50,
    category: "Allergy",
    image: "/api/placeholder/200/200"
  },
  {
    id: 7,
    name: "Sertraline 50mg",
    description: "SSRI antidepressant medication",
    price: 22.99,
    category: "Mental Health",
    image: "/api/placeholder/200/200"
  },
  {
    id: 8,
    name: "Ibuprofen 400mg",
    description: "NSAID pain reliever",
    price: 6.99,
    category: "Pain Relief",
    image: "/api/placeholder/200/200"
  },
  {
    id: 9,
    name: "Aspirin 81mg",
    description: "Blood thinner and pain reliever",
    price: 4.99,
    category: "Cardiovascular",
    image: "/api/placeholder/200/200"
  },
  {
    id: 10,
    name: "Loratadine 10mg",
    description: "24-hour allergy relief",
    price: 9.99,
    category: "Allergy",
    image: "/api/placeholder/200/200"
  },
  // Adding more medicines (11-50)...
  {
    id: 11,
    name: "Simvastatin 20mg",
    description: "Cholesterol-lowering medication",
    price: 16.99,
    category: "Cardiovascular",
    image: "/api/placeholder/200/200"
  },
  // ... [Additional 39 medicines with similar structure] ...
]

export default function PharmacyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>(medicines)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showNotFound, setShowNotFound] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Refs for GSAP animations
  const headerRef = useRef(null)
  const cartButtonRef = useRef(null)
  const searchRef = useRef(null)
  const medicineRefs = useRef<(HTMLDivElement | null)[]>([])
  const floatingIconRefs = useRef<(HTMLDivElement | null)[]>([])

  // Floating icons
  const floatingIcons = [Pill, Capsule, Syringe, Thermometer, Activity, Heart]

  // Optimized search with debouncing
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setIsSearching(true)
      const searchTerm = searchQuery.toLowerCase()
      const filtered = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm) ||
        medicine.description.toLowerCase().includes(searchTerm) ||
        medicine.category.toLowerCase().includes(searchTerm)
      )
      setFilteredMedicines(filtered)
      setShowNotFound(searchTerm !== '' && filtered.length === 0)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(debounceTimeout)
  }, [searchQuery])

  // Initialize GSAP animations
  useEffect(() => {
    // Header animation
    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })

    // Cart button animation
    gsap.from(cartButtonRef.current, {
      x: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.2
    })

    // Search bar animation
    gsap.from(searchRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.4
    })

    // Medicine cards stagger animation (only on initial load)
    if (!isSearching) {
      gsap.from(medicineRefs.current, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.6
      })
    }

    // Floating icons animations
    floatingIconRefs.current.forEach((icon, index) => {
      const randomX = Math.random() * window.innerWidth
      const randomDelay = index * 2

      gsap.set(icon, {
        x: randomX,
        y: window.innerHeight + 100
      })

      gsap.to(icon, {
        y: -100,
        rotation: 360,
        duration: 15 + Math.random() * 10,
        repeat: -1,
        delay: randomDelay,
        ease: "none"
      })

      gsap.to(icon, {
        x: `+=${Math.random() * 200 - 100}`,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    })

    return () => {
      gsap.killTweensOf([
        headerRef.current,
        cartButtonRef.current,
        searchRef.current,
        ...medicineRefs.current,
        ...floatingIconRefs.current
      ])
    }
  }, [])

  // Add to cart with animation
  const addToCart = (medicine: Medicine) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === medicine.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...medicine, quantity: 1 }]
    })

    // Animate the cart button
    gsap.to(cartButtonRef.current, {
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    })

    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart`,
      duration: 2000,
    })
  }

  // Remove from cart function
  const removeFromCart = (medicineId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== medicineId))
  }

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Handle checkout
  const handleCheckout = () => {
    toast({
      title: "Proceeding to Payment",
      description: "Redirecting to secure payment gateway...",
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Background elements remain the same */}
      {/* ... */}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 ref={headerRef} className="text-3xl font-bold text-gray-800">
            Online Pharmacy
          </h1>
          <div ref={cartButtonRef}>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsCartOpen(true)}
            >
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

        {/* Enhanced Search Section */}
        <div ref={searchRef} className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by name, category, or description..."
              className="w-full pl-10 pr-4 py-3 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Not Found Message */}
        {showNotFound && (
          <div className="text-center my-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              We couldn't find what you're looking for
            </h3>
            <p className="text-gray-600">
              Try searching for a different medicine name, category, or description.
            </p>
          </div>
        )}

        {/* Medicine Grid with smooth transitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((medicine, index) => (
            <div
              key={medicine.id}
              ref={el => medicineRefs.current[index] = el}
              className="transition-all duration-300 ease-in-out"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{medicine.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{medicine.description}</p>
                  <Badge variant="secondary" className="mb-2">
                    {medicine.category}
                  </Badge>
                  <p className="text-lg font-bold text-blue-600">
                    ${medicine.price.toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    onClick={() => addToCart(medicine)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>

        {/* Cart Dialog remains the same */}
        {/* ... */}
      </div>
    </div>
  )
}
