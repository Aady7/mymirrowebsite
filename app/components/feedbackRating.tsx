"use client";

import { FaStar } from "react-icons/fa";
import { useState } from "react";

interface FeedbackRatingProps {
    rating: number;
    onRatingChange: (value: number) => void;
}

const FeedbackRating = ({ rating, onRatingChange }: FeedbackRatingProps) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex justify-center gap-8 my-4 w-full max-w-xs mx-auto">
            {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                    key={star}
                    size={40}
                    className={`cursor-pointer transition-colors ${
                        (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => onRatingChange(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                />
            ))}
        </div>
    );
};

export default FeedbackRating; 