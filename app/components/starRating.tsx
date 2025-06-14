"use client";

import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const StarRating = ({ userId, lookId }: { userId: string; lookId: number }) => {
  const supabase = createClientComponentClient();
  const [rating, setRating] = useState<number>(0);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  // Fetch rating from DB on mount
  useEffect(() => {
    const fetchRating = async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select("rating")
        .eq("user_id", userId)
        .eq("look_id", lookId)
        .single();

      if (data && data.rating) {
        setRating(data.rating);
      }
    };

    fetchRating();
  }, [supabase, userId, lookId]);

  // Save rating to DB on click
  const handleRatingChange = async (star: number) => {
    setRating(star);
    setShowMessage(true);

    const { error } = await supabase
      .from("ratings")
      .upsert(
        {
          user_id: userId,
          look_id: lookId,
          rating: star,
        },
        { onConflict: "user_id,look_id" } // ensures 1 rating per user per look
      );

    if (error) {
      console.error("Error saving rating:", error.message);
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
        <div className="bg-white shadow-lg rounded-lg px-6 py-3 text-center text-green-600 font-medium ">
          Thanks Your Response Has Been Recorded
        </div>
      )}
    </div>
  );
};

export default StarRating;
