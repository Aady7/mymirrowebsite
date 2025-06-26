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
        // Use product-rating table for products
        const result = await supabase
          .from("product-rating")
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
        // Handle outfit rating
        console.log("Deleting any existing outfit rating...");
        const { error: deleteError } = await supabase
          .from("outfit_rating")
          .delete()
          .eq("user_id", currentUserId)
          .eq("outfit_id", productId);

        if (deleteError) {
          console.error("Error deleting existing outfit rating:", deleteError);
          // Continue anyway, might be no existing rating
        }

        // Insert new outfit rating
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
      } else {
        // Handle product rating
        console.log("Deleting any existing product rating...");
        const { error: deleteError } = await supabase
          .from("product-rating")
          .delete()
          .eq("user_id", currentUserId)
          .eq("product_id", productIdentifier);

        if (deleteError) {
          console.error("Error deleting existing product rating:", deleteError);
          // Continue anyway, might be no existing rating
        }

        // Insert new product rating
        console.log("Inserting new product rating...");
        const { error: insertError } = await supabase
          .from("product-rating")
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
