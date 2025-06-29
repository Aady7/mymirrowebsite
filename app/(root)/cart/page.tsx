'use client'
import React, { useEffect, useState, useContext } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { FaIndianRupeeSign, FaTrash } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import SmartLoader from '@/app/components/loader/SmartLoader'
import { CartContext } from '@/app/components/provider'

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
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const { getSession } = useAuth()
  const { refreshCart } = useContext(CartContext)

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
          .from('users_updated')
          .select('cart_items')
          .eq('user_id', session.user.id)
          .single()

        if (userError) throw userError

        const items = userData?.cart_items ? JSON.parse(userData.cart_items) : []
        setCartItems(items)

        // Automatically select all cart items
        const allSelectedItems = new Set<string>(items.map((item: CartItem) => `${item.productId}-${item.size}`))
        setSelectedItems(allSelectedItems)

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
        .from('users_updated')
        .update({ cart_items: JSON.stringify(updatedItems) })
        .eq('user_id', session.user.id)

      if (updateError) throw updateError

      setCartItems(updatedItems)
      console.log('✅ Cart updated, refreshing cart count. New items:', updatedItems.length);
      // Refresh cart count in header
      await refreshCart()
    } catch (error) {
      console.error('Error updating cart:', error)
      setError('Failed to update cart. Please try again.')
    }
  }

  const handleQuantityChange = async (productId: number, newQuantity: number, itemSize: string) => {
    if (newQuantity < 1) return

    const updatedItems = cartItems.map(item =>
      item.productId === productId && item.size === itemSize
        ? { ...item, quantity: newQuantity }
        : item
    )

    await updateCart(updatedItems)
  }

  const handleRemoveItem = async (productId: number, size: string) => {
    const updatedItems = cartItems.filter(item => item.productId !== productId || item.size !== size)
    await updateCart(updatedItems)
  }

  const toggleItemSelection = (productId: number, size: string) => {
    const itemKey = `${productId}-${size}`
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemKey)) {
      newSelected.delete(itemKey)
    } else {
      newSelected.add(itemKey)
    }
    setSelectedItems(newSelected)
  }

  const calculateSelectedTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemKey = `${item.productId}-${item.size}`
      if (selectedItems.has(itemKey)) {
        const product = products[item.productId]
        return total + (product?.price || 0) * item.quantity
      }
      return total
    }, 0)
  }

  if (loading) {
    return <SmartLoader />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen font-[Boston]">
        <p className="text-red-500 font-normal">{error}</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center font-[Boston]">
          <h1 className="text-[35px] font-light [font-variant:all-small-caps]">My Cart</h1>
          <p className="text-gray-500 mb-6 font-light">Your cart is empty</p>
          <Link href="/recommendations">
            <button className="bg-[#007e90] hover:bg-[#006d7d] text-white text-[14px] font-medium uppercase py-3 px-6 tracking-wide">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* header section */}
      <div className="text-black font-[Boston] text-[35px] px-[24px] not-italic leading-normal [font-variant:all-small-caps]">
        <h1>MY CART</h1>
      </div>

      {/* Horizontal Line */}
      <div className="px-[24px] mt-[20px] w-full">
        <hr className="border border-gray-700 w-full" />
      </div>

      {/*check box with selected items and price */}
      <div className="flex flex-row items-center justify-start px-[20px] mt-6 gap-3 text-black font-[Boston] text-[14px] not-italic font-normal leading-normal [font-variant:all-small-caps]">
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={selectedItems.size > 0}
            onChange={() => {
              if (selectedItems.size > 0) {
                setSelectedItems(new Set())
              } else {
                setSelectedItems(new Set(cartItems.map(item => `${item.productId}-${item.size}`)))
              }
            }}
          />
          <div className="w-6 h-6 border-1 border-[#007e90] rounded peer-checked:bg-[#007e90] peer-checked:text-white flex items-center justify-center text-[24px] font-normal">
            -
          </div>
        </label>

        <h2 className="flex flex-row items-center text-[20px] font-normal leading-normal m-0 p-0">
          {selectedItems.size}/{cartItems.length} ITEMS SELECTED&nbsp;
          <span className="flex flex-row items-center">
            ( <FaIndianRupeeSign className="mr-[4px] text-[16px] align-middle leading-none" /> {calculateSelectedTotal()} )
          </span>
        </h2>
      </div>

      {/* Cart Items */}
      {cartItems.map((item) => {
        const product = products[item.productId]
        const images = product ? JSON.parse(product.productImages) : []
        const itemKey = `${item.productId}-${item.size}`

        return (
          <div key={itemKey} className="flex flex-row items-start justify-between px-[20px] py-[12px] gap-4 mt-[26px]">
            {/* Left: image with checkbox */}
            <div className="relative inline-block">
              <input
                type="checkbox"
                checked={selectedItems.has(itemKey)}
                onChange={() => toggleItemSelection(item.productId, item.size)}
                className="absolute top-2 left-2 w-6 h-6 border-2 border-[#007e90] rounded appearance-none
                  checked:bg-[#007e90]
                  checked:after:content-['✔'] checked:after:text-white checked:after:text-[14px] checked:after:flex checked:after:items-center checked:after:justify-center"
              />
              <Image
                src={images[0] || "/fallback.jpg"}
                alt={product?.name || "Product image"}
                width={150}
                height={80}
                className="object-cover"
              />
            </div>

            {/* Middle: product details */}
            <div className="flex flex-col flex-grow items-start gap-1 text-black font-[Boston] text-[14px] not-italic font-normal leading-normal [font-variant:all-small-caps]">
              <h1 className="text-[20px] font-medium leading-tight mb-1 mt-[-0.5rem]">{product?.title}</h1>
              <h1 className="text-[18px] mt-[4px] text-gray-400 font-normal">{product?.name}</h1>
              
              {/* Size */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[14px] font-normal">SIZE:</span>
                <span className="text-[14px] font-normal ">{item.size}</span>
              </div>

              {/* Quantity selector */}
              <div className="flex flex-row items-center mt-1 h-7 gap-2 bg-[#007e90] rounded px-1 py-0.5">
                <button
                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1, item.size)}
                  className="text-[16px] font-normal px-1 text-white bg-[#007e90] rounded h-6 w-6 flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-[15px] font-normal text-[#007e90] bg-white px-2 py-0.5 rounded h-6 flex items-center justify-center">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1, item.size)}
                  className="text-[16px] font-normal px-1 text-white bg-[#007e90] rounded h-6 w-6 flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {/* Price */}
              <span className="flex flex-row items-center text-[18px] font-normal mt-2">
                <FaIndianRupeeSign className="mr-[4px] text-[18px] align-middle leading-none" /> {product?.price}
              </span>
            </div>

            {/* Right: delete icon */}
            <div className="self-start">
              <Button
                variant="ghost"
                onClick={() => handleRemoveItem(item.productId, item.size)}
                className="flex items-center justify-center p-2 w-8 h-8 bg-transparent hover:bg-gray-100 rounded"
              >
                <FaTrash className="text-red-500 w-4 h-4" />
              </Button>
            </div>
          </div>
        )
      })}

      {/* Horizontal Line */}
      <div className="px-[24px] mt-[20px] w-full">
        <hr className="border border-gray-700 w-full" />
      </div>

      {/* billing section */}
      <div className="px-[24px] md:p-6 lg:p-8">
        <div className="border border-black px-4 mt-9 py-4 w-full max-w-sm text-black font-[Boston] text-[16px] not-italic leading-normal [font-variant:all-small-caps]">
          {/* Header */}
          <h2 className="text-[16px] font-medium mb-3 border-b border-dashed border-gray-400 pb-2">
            PRICE DETAILS ({selectedItems.size} Items)
          </h2>

          {/* Total MRP */}
          <div className="flex justify-between items-center mb-3">
            <span className="font-normal">Total MRP</span>
            <span className="text-[18px] font-normal flex items-center">
              <FaIndianRupeeSign className="mr-[4px] text-[18px] align-middle leading-none" /> {calculateSelectedTotal()}
            </span>
          </div>

          {/* Stylist Fee */}
          <div className="flex justify-between items-center mb-3">
            <span className="flex items-center font-normal">
              Stylist Fee
              
            </span>
            <span className="text-green-500 font-normal">FREE</span>
          </div>

          {/* Shipping Fee */}
          <div className="flex justify-between items-center mb-3 border-b border-dashed border-gray-400 pb-2">
            <span className="font-normal">Shipping Fee</span>
            <span className="text-green-500 font-normal">FREE</span>
          </div>

          {/* Total Amount */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-[18px] font-medium">Total Amount</span>
            <span className="text-[18px] font-medium flex items-center">
              <FaIndianRupeeSign className="mr-[4px] text-[18px] align-middle leading-none" /> {calculateSelectedTotal()}
            </span>
          </div>
        </div>
      </div>

      {/* place order */}
      <div className="w-full mt-9 px-4 py-6 flex flex-col items-center justify-center gap-3 border-t border-gray-200">
        {/* Text */}
        <p className="text-[14px] text-gray-500 not-italic leading-normal">
          {selectedItems.size} {selectedItems.size === 1 ? 'Item' : 'Items'} selected for order
        </p>

        {/* Place Order button */}
        <button 
          className="w-full max-w-xs bg-[#007e90] hover:bg-[#006d7d] text-white text-[14px] font-[Boston] font-medium uppercase py-3 px-6 tracking-wide rounded"
          disabled={selectedItems.size === 0}
        >
          Place Order
        </button>
      </div>
    </>
  )
}

export default CartPage 