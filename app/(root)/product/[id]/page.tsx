'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import supabase from '@/lib/supabaseClient'
import Image from 'next/image'
import { useAuth } from '@/lib/hooks/useAuth'

import Link from 'next/link'

interface Product {
  id: number
  created_at: string
  url: string
  title: string
  name: string
  overallRating: number
  price: number
  mrp: number
  discount: string
  sizesAvailable: string
  productImages: string
  specifications: string
}

interface CartItem {
  productId: number | undefined
  size: string
  quantity: number
  addedAt: string
}

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getSession } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError('Please select a size')
      return
    }

    setIsAddingToCart(true)
    setError(null)

    try {
      const { session } = await getSession()
      if (!session) {
        setError('Please sign in to add items to cart')
        return
      }

      // Get current cart items
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('cartitems')
        .eq('userid', session.user.id)
        .single()

      if (userError) throw userError

      // Parse existing cart items or initialize empty array
      const currentCartItems = userData?.cartitems ? JSON.parse(userData.cartitems) : []
      
      // Check if the product with the same size already exists in cart
      const existingItemIndex = currentCartItems.findIndex(
        (item: CartItem) => item.productId === product?.id && item.size === selectedSize
      )

      let updatedCartItems: CartItem[]

      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        updatedCartItems = currentCartItems.map((item: CartItem, index: number) => 
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // If item doesn't exist, add new item
        const newCartItem = {
          productId: product?.id,
          size: selectedSize,
          quantity: 1,
          addedAt: new Date().toISOString()
        }
        updatedCartItems = [...currentCartItems, newCartItem]
      }

      // Update user's cart in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ cartitems: JSON.stringify(updatedCartItems) })
        .eq('userid', session.user.id)

      if (updateError) throw updateError

      // Show success message
      alert('Item added to cart successfully!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      setError('Failed to add item to cart. Please try again.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-gray-600">Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Product not found</p>
      </div>
    )
  }

  const images = JSON.parse(product.productImages)
  const sizes = JSON.parse(product.sizesAvailable)
  const specifications = JSON.parse(product.specifications)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative h-[500px] w-full overflow-hidden rounded-lg bg-gray-100">
            {images.length > 0 ? (
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
          
          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-indigo-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">{product.title}</h1>
            <p className="text-lg text-gray-100 mt-2">by {product.name}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-green-100 px-3 py-1 rounded">
              <span className="text-lg font-medium text-green-800">{product.overallRating}</span>
              <svg className="w-5 h-5 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-100">₹{product.price}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-gray-100 line-through ml-3">₹{product.mrp}</span>
                  <span className="ml-3 text-lg font-medium text-green-600">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-100 mb-3">Available Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    selectedSize === size
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'hover:border-indigo-600 hover:text-indigo-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {error && selectedSize === null && (
              <p className="text-red-500 mt-2">{error}</p>
            )}
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-3">Specifications</h3>
            <div className="space-y-2">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <span className="text-gray-100">{key}</span>
                  <span className="text-gray-100">{value as string}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
            <Link
              href={`/checkout`}
              className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300"
            >
              Buy Now
            </Link>
          </div>
          {error && selectedSize !== null && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail 