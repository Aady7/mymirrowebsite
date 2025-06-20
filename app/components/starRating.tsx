"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const StarRating = ({ productId }: { productId: string }) => {
  const { getSession } = useAuth();
  const supabase = createClientComponentClient();
  const [rating, setRating] = useState<number>(0);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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
    if (!currentUserId) return;
    
    const fetchRating = async () => {
      const { data, error } = await supabase
        .from("product-rating")
        .select("rating")
        .eq("user_id", currentUserId)
        .eq("product_id", parseInt(productId, 10))
        .single();

      if (data?.rating) {
        setRating(data.rating);
      }

      if (error && error.code !== "PGRST116") {
        console.error("Fetch rating error:", error.message);
      }
    };

    fetchRating();
  }, [supabase, currentUserId, productId]);

  // Handle rating click
  const handleRatingChange = async (star: number) => {
    if (!isLoggedIn || !currentUserId) {
      setMessage("Please log in to rate this product");
      setShowMessage(true);
      return;
    }

    setRating(star);
    //setMessage("Thanks! Your response has been recorded.");
    //setShowMessage(true);

    console.log('Attempting to save rating:', { user_id: currentUserId, product_id: parseInt(productId, 10), rating: star });

    // First check if rating exists
    const { data: existingRating } = await supabase
      .from("product-rating")
      .select("rating")
      .eq("user_id", currentUserId)
      .eq("product_id", parseInt(productId, 10))
      .single();

    let error;
    if (existingRating) {
      // Update existing rating
      const { error: updateError } = await supabase
        .from("product-rating")
        .update({ rating: star })
        .eq("user_id", currentUserId)
        .eq("product_id", parseInt(productId, 10));
      error = updateError;
    } else {
      // Insert new rating
      const { error: insertError } = await supabase
        .from("product-rating")
        .insert({
          user_id: currentUserId,
          product_id: parseInt(productId, 10),
          rating: star,
        });
      error = insertError;
    }

    if (error) {
      console.error("Error saving rating:", error.message);
      setShowMessage(false);
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
              rating >= star ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => handleRatingChange(star)}
          />
        ))}
      </div>
      {showMessage && (
        <div className={`bg-white shadow-lg rounded-lg px-6 py-3 text-center font-medium ${
          !isLoggedIn ? "text-red-600" : "text-green-600"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default StarRating;
