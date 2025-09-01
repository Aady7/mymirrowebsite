"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import CheckoutTracker from "./tracker";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { OrderService } from "@/lib/service/orderservice";
import { usePhonePeAuth } from "@/lib/hooks/usePhonePeAuth";
import { usePhonePePayment } from "@/lib/hooks/usePhonePePayment";

interface CartItem{
  productId:number;
  size:string;
  quantity:number;
  addedAt:string;
  price:number;
}


const Address = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState({
    name: "",
    mobileNo: "",
    pincode: "",
    address: "",
    town: "",
    city: "",
    state: "",
    addressType: "",
    default: false,
  })
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [userid, setUserid] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orderId, setOrderId] = useState<string | null>(null)
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { authToken, fetchAuthToken, authLoading, error: authError, status: authStatus } = usePhonePeAuth();
  const { createPayment, paymentLoading,  status: paymentStatus } = usePhonePePayment(authToken, orderId, totalAmount);
  const { getSession } = useAuth()
  const router= useRouter()
  
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true)
        const session = await getSession()
        console.log("Session data:", session) // Debug log
        
        if (session && session.session && session.session.user) {
          console.log("User ID found:", session.session.user.id) // Debug log
          setUserid(session.session.user.id)
        } else {
          console.log("No session or user found") // Debug log
          // Try to get session directly from Supabase as fallback
          const { data: { session: supabaseSession } } = await supabase.auth.getSession()
          if (supabaseSession?.user?.id) {
            console.log("Fallback user ID:", supabaseSession.user.id) // Debug log
            setUserid(supabaseSession.user.id)
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    const cartLocalStorage = localStorage.getItem('mymirro_cart_items')
    const cartItems = cartLocalStorage ? JSON.parse(cartLocalStorage) : []
    console.log("Cart items:", cartItems)
    
    const productIds = cartItems.map((item: CartItem) => item.productId)
    
    const fetchPrice = async () => {
      if (productIds.length === 0) {
        setCartItems([])
        setTotalAmount(0)
        return
      }
      
      const { data: products, error: productsError } = await supabase.from('products').select('id, price').in('id', productIds)
      if (productsError) {
        console.error("Error fetching products:", productsError)
        return
      }
      
      const productMap = new Map(products.map((product: any) => [product.id, product]))
      const updatedCartItems = cartItems.map((item: CartItem) => {
        const product = productMap.get(item.productId)
        return { ...item, price: product?.price || 0 }
      })
      
      setCartItems(updatedCartItems)
      
      // Calculate total amount
      const total = updatedCartItems.reduce((sum:any, item:any) => sum + (item.price * item.quantity), 0)
      setTotalAmount(total)
      console.log("Updated cart items:", updatedCartItems)
      console.log("Total amount:", total)
    }
    const fetchDefaultAddress= async()=>{
      const localAddress= localStorage.getItem("mymirro_default_address")
      if(localAddress){
        setAddress(JSON.parse(localAddress))
      }
    }
    fetchDefaultAddress()
    fetchPrice()
    fetchSession()

  }, [getSession])

  const handleCancelOrder= async()=>{
    if(!orderId){
      
      return
    }
    try{
      await OrderService.cancelOrder(orderId)
      setOrderId(null)
      setTotalAmount(0)
      setCartItems([])
      router.push("/cart")
      setError(false)
    }catch(error){
      console.error("Error cancelling order:", error)
      setError(true)
      setErrorMessage("Failed to cancel order")
    }
  }   

  useEffect(()=>{
    if(paymentStatus==="Cancelled"){
      console.log("Payment cancelled")
      handleCancelOrder()
      
    }
    
  },[paymentStatus])

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setAddress({ ...address, [name]: checked });
    } else {
      setAddress({ ...address, [name]: value });
    }
  }

  const validateAddress = () => {
    if (address.name === "" || address.mobileNo === "" || address.pincode === "" || address.address === "" || address.town === "" || address.city === "" || address.state === "" ) {
      setError(true)
      setErrorMessage("Please fill all the fields")
      return false;
    }
    if (address.pincode.length !== 6) {
      setError(true)
      setErrorMessage("Pincode must be 6 digits")
      return false;
    }
    if (address.mobileNo.length !== 10) {
      setError(true)
      setErrorMessage("Mobile number must be 10 digits")
      return false;
    }
    
    return true;
  }

  //creating order
  const createOrder = async () => {
    if (!userid) {
      setError(true)
      setErrorMessage("User not authenticated. Please login again.")
      return
    }
    if (cartItems.length === 0) {
      setError(true)
      setErrorMessage("No items in cart")
      return
    }
    try {
      const { order_id, total_amount } = await OrderService.createOrder(userid, cartItems, address)
      console.log("Order created successfully:", order_id)
      console.log("Total amount:", total_amount)
      setOrderId(order_id);
      setTotalAmount(total_amount);
      setError(false)
      
    } catch (error) {
      console.error("Error creating order:", error)
      setError(true)
      router.push("/cart")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check if userid is available
    if (!userid) {
      setError(true)
      setErrorMessage("User not authenticated. Please login again.")
      return;
    }
    
    if (validateAddress()) {
      setError(false)
      console.log("Submitting address with userid:", userid); // Debug log
      console.log("Address data:", address); // Debug log
      console.log("cart items", cartItems);
      const defaultAddress= address.default;
      const localAddress= localStorage.getItem("mymirro_default_address")
      if(defaultAddress && !localAddress){
        localStorage.setItem("mymirro_default_address", JSON.stringify(address))
      }
      
      try {
        const { data, error } = await supabase.from("address").insert({
          userid: userid,
          name: address.name,
          phone: address.mobileNo,
          pincode: address.pincode,
          address: address.address,
          town: address.town,
          district: address.city,
          state: address.state,
          address_type: address.addressType,
        })
        
        if (error) {
          console.error("Supabase error:", error) // Debug log
          setError(true)
          setErrorMessage(error.message)
        } else {
          console.log("Address saved successfully:", data) // Debug log
          setError(false)
          // Show success message and redirect back to cart
          alert("Address saved successfully! You can now proceed with affiliate purchases.")
          router.push("/cart")
        }
      } catch (err) {
        console.error("Unexpected error:", err) // Debug log
        setError(true)
        setErrorMessage("An unexpected error occurred")
      }

      // ORDER CREATION AND PAYMENT DISABLED FOR AFFILIATE MARKETING
      // createOrder();
      // fetchAuthToken();
      // if(authError){
      //   setError(true)
      //   setErrorMessage("Authentication error. Please try again.")
      //   router.push("/cart")
      //   return
      // }
      
    } else {
      setError(true)
      return;
    }
  }

  const [itemCount, setItemCount] = useState(1); // make this dynamic if needed
  
  // Show loading state while fetching session
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <>
      {/* ORDER AND PAYMENT SECTION - HIDDEN FOR AFFILIATE MARKETING */}
      {false && orderId ? (
        <div className="w-full max-w-2xl mx-auto px-4 md:px-6 lg:px-8 py-6" style={{display: 'none'}}>
        <CheckoutTracker currentStep={currentStep} />
      
        {/* Order Summary Box */}
        <div className="border border-gray-300 rounded-md shadow-sm p-4 mt-6 bg-white">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Order Summary</h2>
      
          {/* Order Total */}
          <div className="flex justify-between text-sm text-gray-700 border-b pb-2 mb-2">
            <span className="font-medium">Order Total</span>
            <span className="font-semibold text-black text-base">₹{totalAmount}</span>
          </div>
      
          {/* Order ID */}
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Order ID</span>
            <span className="text-gray-800 font-mono">{orderId}</span>
          </div>
      
          {/* Payment Method */}
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Payment Method</span>
            <span className="text-gray-800">Online</span>
          </div>
      
          {/* Shipping Address */}
          <div className="text-sm text-gray-600 mt-4">
            <p className="font-medium text-gray-700 mb-1">Shipping Address:</p>
            <p>
              {address.name}, {address.mobileNo}<br />
              {address.address}, {address.town}<br />
              {address.city} - {address.pincode}, {address.state}
            </p>
          </div>
        </div>
      
        {/* Pay Now Button */}
        <button
          onClick={createPayment}
          disabled={paymentLoading || !authToken}
          className="mt-6 bg-[#007e90] hover:bg-[#006874] text-white font-semibold py-2 px-4 w-full rounded-md transition-transform duration-200 hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {paymentLoading ? "Processing..." : "PAY NOW"}
        </button>
        <button onClick={handleCancelOrder} className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 w-full rounded-md transition-transform duration-200 hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed">
          CANCEL ORDER
        </button>
      
        {/* Payment Status Message */}
       
      </div>
      
      ) : (
        <form onSubmit={handleSubmit}>
     
      
        <div className="w-full px-[24px] md:px-6 lg:px-8 py-4 mt- 0">
          <h1 className="text-black text-[25px] font-semibold font-[Boston] [font-variant:all-small-caps] leading-none">
            ADD NEW ADDRESS
          </h1>
        </div>

        {/*tracker */}
        <CheckoutTracker currentStep={currentStep} />

        {/*Contact details */}
        <div className="w-full max-w-sm px-[24px] md:px-6 lg:px-8 py-4">
          <div className="grid w-full gap-3">
            <label className="text-black text-[20px] font-medium tracking-wide [font-variant:all-small-caps]">
              CONTACT DETAILS
            </label>
            <Input
              type="text"
              id="Name"
              name="name"
              placeholder="Name*"
              className="w-full h-12 rounded-none"
              value={address.name}
              onChange={handleChange}
              
            />
            <Input
              type="number"
              id="number"
              name="mobileNo"
              placeholder="Mobile No*"
              className="w-full h-12 rounded-none"
              value={address.mobileNo}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Horizontal Line */}
        <div className="px-[24px] mt-[20px] w-full">
          <hr className="border border-gray-400 w-full" />
        </div>

        {/* address section */}
        <div className="w-full px-[20px] md:px-6 lg:px-8 py-4 mt-4">
          <h1 className="text-black text-[25px] font-semibold font-[Boston] [font-variant:all-small-caps] leading-none">
            ADDRESS
          </h1>
        </div>

        {/*location */}
        <div className="w-full ">
          <div className="flex justify-start">
            <Button className="flex flex-row items-center justify-center gap-2 bg-white text-black  px-6 py-2 rounded-none text-sm">
              <span className="flex items-center">
                <Image
                  src="/assets/location.svg"
                  alt="location"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </span>
              <span className="font-semibold">USE MY CURRENT LOCATION</span>
            </Button>
          </div>
        </div>

        <div className="w-full max-w-sm px-[24px] md:px-6 lg:px-8 py-4">
          <div className="grid w-full gap-3">
            <Input
              type="number"
              id="pin"
              name="pincode"
              placeholder="PinCode*"
              className="w-full h-12 rounded-none"
              value={address.pincode}
              onChange={handleChange}
            />
            <Input
              type="text"
              id="address"
              name="address"
              placeholder="Address(House No,Building,Street,Area)*"
              className="w-full h-12 rounded-none"
              value={address.address}
              onChange={handleChange}
            />
            <Input
              type="text"
              id="town"
              name="town"
              placeholder=" Location / Town*"
              className="w-full h-12 rounded-none"
              value={address.town}
              onChange={handleChange}
            />
            <Input
              type="text"
              id="city"
              name="city"
              placeholder="City / District*"
              className="w-full h-12 rounded-none"
              value={address.city}
              onChange={handleChange}
            />
            <Input
              type="text"
              id="state"
              name="state"
              placeholder=" State*"
              className="w-full h-12 rounded-none"
              value={address.state}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Horizontal Line */}
        <div className="px-[24px] mt-[20px] w-full">
          <hr className="border border-gray-400 w-full" />
        </div>

        {/*address type */}
        <div className="w-full max-w-sm mt-[20px] px-[24px] md:px-6 lg:px-8 py-4">
          <div className="grid w-full gap-3">
            <label className="text-black text-[20px] font-medium tracking-wide [font-variant:all-small-caps]">
              ADDRESS TYPE
            </label>

            {/* Radio Buttons Row */}
            <div className="flex flex-wrap gap-6">
              {/* Home */}
              <div className="flex items-center gap-2">
                <Input
                  type="radio"
                  id="home"
                  name="addressType"
                  className="w-5 h-5"
                  value="home"
                  checked={address.addressType === "home"}
                  onChange={handleChange}
                />
                <label htmlFor="home" className="text-sm">
                  Home
                </label>
              </div>

              {/* Office */}
              <div className="flex items-center gap-2">
                <Input
                  type="radio"
                  id="office"
                  name="addressType"
                  className="w-5 h-5"
                  value="office"
                  checked={address.addressType === "office"}
                  onChange={handleChange}
                />
                <label htmlFor="office" className="text-sm">
                  Office
                </label>
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 mt-4">
            <Input
              type="checkbox"
              id="default"
              name="default"
              checked={address.default}
              className="w-5 h-5"
              onChange={handleChange}
            />
            <label htmlFor="default" className="text-sm">
              Make this my default address
            </label>
          </div>
        </div>

        {/* Horizontal Line */}
        <div className="  mt-[20px] w-full">
          <hr className="border border-gray-400 w-full" />
        </div>

        <div className="w-full flex justify-center gap-5 mt-6 mb-3 flex-wrap">
          <Link href="/cart">
          <button className="text-black bg-white border-2 border-gray-400 px-6 py-2 w-40 rounded-none hover:bg-gray-200">
            CANCEL
          </button>
          
          </Link>
          <button type="submit" className="text-white bg-[#007e90] border-2 border-[#007e90] px-6 py-2 w-40 rounded-none hover:bg-[#007e90]"> 
            SAVE
          </button>
          {error && <p className="text-red-500 text-center w-full mt-2">{errorMessage}</p>}
        </div>
      </form>
      )}
    </>
  );
}


export default Address;
