"use client";

import React, { useEffect, useState } from "react";
import StarRating from "./starRating";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FeedbackProps {
    onClose: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({ onClose }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [lookId, setLookId] = useState<number>(1);
    const [formData, setFormData] = useState({
        overallRating: 0,
        designRating: 0,
        colorRating: 0,
        comment: ""
    });

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            }
        };
        getUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('feedback')
                .insert([
                    {
                        user_id: userId,
                        look_id: lookId,
                        overall_rating: formData.overallRating,
                        design_rating: formData.designRating,
                        color_rating: formData.colorRating,
                        comment: formData.comment
                    }
                ]);

            if (error) throw error;
            // Reset form after successful submission
            setFormData({
                overallRating: 0,
                designRating: 0,
                colorRating: 0,
                comment: ""
            });
            alert("Feedback submitted successfully!");
            onClose(); // Close the feedback form after successful submission
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to submit feedback. Please try again.");
        }
    };

    if (!userId) return null;

    return (
        <div className="w-full bg-black text-gray-300 flex items-center justify-center p-2 rounded-t-4xl">
            <div className="w-full max-w-2xl bg-gray-900/90 rounded-lg p-6 relative">
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors"
                        aria-label="Close feedback form"
                    >
                        <X size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-center flex-1 text-gray-200">Feedback</h1>
                    
                    <div className="w-6" /> {/* Spacer for alignment */}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-gray-400">How well did this product work for you overall?</label>
                        <StarRating userId={userId} lookId={lookId} />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-400">How do you feel about the design and styling of this piece?</label>
                        <StarRating userId={userId} lookId={lookId} />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-400">What's your take on the color, did it match your expectations?</label>
                        <StarRating userId={userId} lookId={lookId} />
                    </div>

                    <div className="space-y-2">
                        <textarea 
                            name="comment"
                            value={formData.comment}
                            onChange={(e) => setFormData({...formData, comment: e.target.value})}
                            placeholder="Anything you'd like us to know?"
                            className="w-full h-32 p-3 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-gray-500"
                        />
                    </div>

                    <Button 
                        type="submit"
                        className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200"
                    >
                        Submit
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-700" />
            </div>
        </div>
    );
}

export default Feedback;