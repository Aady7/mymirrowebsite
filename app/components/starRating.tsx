"use client";

import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const StarRating = ({ userId, lookId }: { userId: string; lookId: number }) => {
  const supabase = createClientComponentClient();
  const [rating, setRating] = useState<number>(0);

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
    <div className="flex justify-center gap-10 my-4 w-full max-w-xs mx-auto">
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
  );
};

export default StarRating;
