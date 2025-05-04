'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import supabase from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  productId: number
  size: string
  quantity: number
  addedAt: string
}

interface Product {
  id: number
  title: string
  name: string
  price: number
  mrp: number
  productImages: string
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [products, setProducts] = useState<{ [key: number]: Product }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getSession } = useAuth()

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { session } = await getSession()
        if (!session) {
          setError('Please sign in to view your cart')
          return
        }

        // Fetch user's cart items
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('cartitems')
          .eq('userid', session.user.id)
          .single()

        if (userError) throw userError

        const items = userData?.cartitems ? JSON.parse(userData.cartitems) : []
        setCartItems(items)

        // Fetch product details for all items in cart
        if (items.length > 0) {
          const productIds = items.map((item: CartItem) => item.productId)
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('id, title, name, price, mrp, productImages')
            .in('id', productIds)

          if (productsError) throw productsError

          // Create a map of products by ID
          const productsMap = productsData.reduce((acc: { [key: number]: Product }, product: Product) => {
            acc[product.id] = product
            return acc
          }, {})

          setProducts(productsMap)
        }
      } catch (error) {
        console.error('Error fetching cart items:', error)
        setError('Failed to load cart items. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  const updateCart = async (updatedItems: CartItem[]) => {
    try {
      const { session } = await getSession()
      if (!session) {
        setError('Please sign in to update your cart')
        return
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ cartitems: JSON.stringify(updatedItems) })
        .eq('userid', session.user.id)

      if (updateError) throw updateError

      setCartItems(updatedItems)
    } catch (error) {
      console.error('Error updating cart:', error)
      setError('Failed to update cart. Please try again.')
    }
  }

  const handleQuantityChange = async (productId: number, newQuantity: number, itemSize:string) => {
    if (newQuantity < 1) return

    const updatedItems = cartItems.map(item => 
      item.productId === productId && item.size === itemSize
        ? { ...item, quantity: newQuantity }
        : item
    )

    await updateCart(updatedItems)
  }

  const handleRemoveItem = async (productId: number, size:string) => {
    const updatedItems = cartItems.filter(item => item.productId !== productId || item.size !== size)
    await updateCart(updatedItems)
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.productId]
      return total + (product?.price || 0) * item.quantity
    }, 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-gray-600">Loading cart...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link
            href="/recommendations"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => {
            const product = products[item.productId]
            const images = product ? JSON.parse(product.productImages) : []
            
            return (
              <div key={`${item.productId}-${item.size}`} className="flex gap-6 p-6 border rounded-lg">
                {/* Product Image */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  {images.length > 0 ? (
                    <img
                      src={images[0]}
                      alt={product?.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">No image</p>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <Link href={`/product/${item.productId}`}>
                    <h3 className="text-lg font-semibold hover:text-indigo-600">{product?.title}</h3>
                  </Link>
                  <p className="text-gray-600">{product?.name}</p>
                  <p className="text-gray-600 mt-1">Size: {item.size}</p>
                  
                  <div className="flex items-center mt-2">
                    <span className="text-lg font-bold">₹{product?.price}</span>
                    {product?.mrp && product.mrp > product.price && (
                      <span className="text-gray-500 line-through ml-2">₹{product.mrp}</span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center mt-4">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1, item.size)}
                      className="w-8 h-8 flex items-center justify-center border rounded-l-md hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-12 h-8 flex items-center justify-center border-t border-b">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1, item.size)}
                      className="w-8 h-8 flex items-center justify-center border rounded-r-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.productId, item.size)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{calculateTotal()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            </div>
            <Link   href={"/checkout"}>

            <button
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300"
            >
              Proceed to Checkout
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage 