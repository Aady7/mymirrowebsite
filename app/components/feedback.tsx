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
        <div className="w-full bg-black rounded-t-2xl max-h-[90vh] flex flex-col fixed bottom-0 left-0 right-0">
            <div className="w-full mb-[25px] flex items-center justify-between bg-[#1F1F1F] p-4 rounded-t-2xl">
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Close feedback form"
                    
                >
                    <X size={24} />
                </button>
                <h1 className="text-lg font-light tracking-wide text-center flex-1 text-gray-200">Feedback</h1>
                <div className="w-[24px]"></div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 py-3 overflow-y-auto">
                <div className="space-y-4 flex-1 px-[20px]">
                    <div className="space-y-2 mb-[30px]">
                        <label className="block text-gray-400 text-sm">How well did this product work for you overall?</label>
                        <div className="px-8">
                            <StarRating userId={userId} lookId={lookId} />
                        </div>
                    </div>

                    <div className="space-y-2 mb-[30px]">
                        <label className="block text-gray-400 text-sm">How do you feel about the design and styling of this piece?</label>
                        <div className="px-8">
                            <StarRating userId={userId} lookId={lookId} />
                        </div>
                    </div>

                    <div className="space-y-2 mb-[30px]">
                        <label className="block text-gray-400 text-sm">What's your take on the color, did it match your expectations?</label>
                        <div className="px-8">
                            <StarRating userId={userId} lookId={lookId} />
                        </div>
                    </div>

                    <div className="space-y-2 mb-[30px]">
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            placeholder="Anything you'd like us to know?"
                            className="w-full h-[186px] p-3 rounded-none bg-black text-gray-200 tracking-wider text-xs placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-gray-500"
                        />
                    </div>
                </div>

                <div className="mt-[35px] flex justify-center pb-1 ">
                    <Button
                        type="submit"
                        className="w-[180px] h-16 rounded-t-2xl bg-[#1F1F1F] hover:bg-gray-600 text-gray-200 text-base font-light tracking-wide font-[Boston]"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Feedback;