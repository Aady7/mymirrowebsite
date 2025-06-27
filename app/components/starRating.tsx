"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const StarRating = ({ productId, productType = 'product' }: { productId: string, productType?: 'product' | 'look' }) => {
  const { getSession } = useAuth();
  const supabase = createClientComponentClient();
  const [rating, setRating] = useState<number>(0);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create a unique identifier for the product
  const getProductIdentifier = () => {
    if (productType === 'look') {
      return `look_${productId}`;
    }
    return productId;
  };

  const productIdentifier = getProductIdentifier();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const { session } = await getSession();
      setIsLoggedIn(!!session);
      setCurrentUserId(session?.user?.id || null);
    };
    checkLoginStatus();
  }, [getSession]);

  // Fetch user's rating from Supabase
  useEffect(() => {
    if (!currentUserId || !productId || productId === 'undefined') return;
    
    const fetchRating = async () => {
      let data, error;
      
      if (productType === 'look') {
        // Use outfit_rating table for looks
        const result = await supabase
          .from("outfit_rating")
          .select("rating")
          .eq("user_id", currentUserId)
          .eq("outfit_id", productId)
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Use product_rating table for products
        const result = await supabase
          .from("product_rating")
          .select("rating")
          .eq("user_id", currentUserId)
          .eq("product_id", productIdentifier)
          .single();
        data = result.data;
        error = result.error;
      }

      if (data?.rating) {
        setRating(data.rating);
      }

      if (error && error.code !== "PGRST116") {
        console.error("Fetch rating error:", error.message);
      }
    };

    fetchRating();
  }, [supabase, currentUserId, productIdentifier, productId, productType]);

  // Handle rating click
  const handleRatingChange = async (star: number) => {
    if (!isLoggedIn || !currentUserId) {
      setMessage("Please log in to rate this product");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    setIsLoading(true);
    setRating(star);

    console.log('Attempting to save rating:', { user_id: currentUserId, product_id: productIdentifier, rating: star });

    try {
      if (productType === 'look') {
        // Handle outfit rating - check if exists, then update or insert
        console.log("Checking for existing outfit rating...");
        
        const { data: existingRating, error: checkError } = await supabase
          .from("outfit_rating")
          .select("*")
          .eq("user_id", currentUserId)
          .eq("outfit_id", productId)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error("Error checking existing rating:", checkError);
          setMessage(`Failed to save rating: ${checkError.message}`);
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 5000);
          return;
        }

        if (existingRating) {
          // Update existing rating while preserving other fields
          console.log("Updating existing outfit rating...");
          const { error: updateError } = await supabase
            .from("outfit_rating")
            .update({
              rating: star,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", currentUserId)
            .eq("outfit_id", productId);

          if (updateError) {
            console.error("Error updating outfit rating:", updateError);
            setMessage(`Failed to save rating: ${updateError.message}`);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
            return;
          }
        } else {
          // Insert new rating
          console.log("Inserting new outfit rating...");
          const { error: insertError } = await supabase
            .from("outfit_rating")
            .insert({
              user_id: currentUserId,
              outfit_id: productId,
              rating: star,
            });

          if (insertError) {
            console.error("Error inserting outfit rating:", insertError);
            setMessage(`Failed to save rating: ${insertError.message}`);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
            return;
          }
        }
      } else {
        // Handle product rating - check if exists, then update or insert
        console.log("Checking for existing product rating...");
        
        const { data: existingRating, error: checkError } = await supabase
          .from("product_rating")
          .select("*")
          .eq("user_id", currentUserId)
          .eq("product_id", productIdentifier)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error("Error checking existing product rating:", checkError);
          setMessage(`Failed to save rating: ${checkError.message}`);
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 5000);
          return;
        }

        if (existingRating) {
          // Update existing rating while preserving other fields
          console.log("Updating existing product rating...");
          const { error: updateError } = await supabase
            .from("product_rating")
            .update({
              rating: star,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", currentUserId)
            .eq("product_id", productIdentifier);

          if (updateError) {
            console.error("Error updating product rating:", updateError);
            setMessage(`Failed to save rating: ${updateError.message}`);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
            return;
          }
        } else {
          // Insert new rating
          console.log("Inserting new product rating...");
          const { error: insertError } = await supabase
            .from("product_rating")
            .insert({
              user_id: currentUserId,
              product_id: productIdentifier,
              rating: star,
            });

          if (insertError) {
            console.error("Error inserting product rating:", insertError);
            setMessage(`Failed to save rating: ${insertError.message}`);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
            return;
          }
        }
      }

      console.log("Rating saved successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessage("An unexpected error occurred. Please try again.");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center gap-8 my-4 w-full max-w-xs mx-auto">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={40}
            className={`cursor-pointer transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            } ${
              rating >= star ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => !isLoading && handleRatingChange(star)}
          />
        ))}
      </div>
      {isLoading && (
        <div className="text-blue-600 font-medium mb-2">
          Saving rating...
        </div>
      )}
      {showMessage && (
        <div className={`bg-white shadow-lg rounded-lg px-6 py-3 text-center font-medium ${
          message.includes("Error") || message.includes("Failed") ? "text-red-600" : "text-green-600"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default StarRating;
