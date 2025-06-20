import { supabase } from '@/lib/supabase'

interface CartItem {
  productId: number | undefined
  size: string
  quantity: number
  addedAt: string
}

export const addToCart = async (
  userId: string,
  itemId: number,
  selectedSize: string,
  itemType: 'product' | 'look' = 'product'
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Get current cart items
    const { data: userData, error: userError } = await supabase
      .from('users_updated')
      .select('cart_items')
      .eq('user_id', userId)
      .single()

    if (userError) throw userError

    // Parse existing cart items or initialize empty array
    const currentCartItems = userData?.cart_items ? JSON.parse(userData.cart_items) : []

    // Check if the item with the same size already exists in cart
    const existingItemIndex = currentCartItems.findIndex(
      (item: CartItem) => item.productId === itemId && item.size === selectedSize
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
        productId: itemId,
        size: selectedSize,
        quantity: 1,
        addedAt: new Date().toISOString()
      }
      updatedCartItems = [...currentCartItems, newCartItem]
    }

    // Update user's cart in database
    const { error: updateError } = await supabase
      .from('users_updated')
      .update({ cart_items: JSON.stringify(updatedCartItems) })
      .eq('user_id', userId)

    if (updateError) throw updateError

    return { success: true, error: null }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return { success: false, error: 'Failed to add item to cart. Please try again.' }
  }
} 