"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FeedbackRating from "./feedbackRating";

interface FeedbackProps {
    onClose: () => void;
    productId: number;
}

const Feedback: React.FC<FeedbackProps> = ({ onClose, productId }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState({
        overallRating: 0,
        designRating: 0,
        colorRating: 0,
        comment: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserId(user.id);
                    setIsAuthenticated(true);
                    
                    // Fetch existing feedback from product_rating table
                    const { data: feedbackData, error } = await supabase
                        .from('product_rating')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('product_id', productId)
                        .single();

                    if (feedbackData) {
                        setFormData({
                            overallRating: feedbackData.overall_rating || 0,
                            designRating: feedbackData.design_rating || 0,
                            colorRating: feedbackData.color_rating || 0,
                            comment: feedbackData.comment || ""
                        });
                    }
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        getUser();
    }, [productId]);

    const handleRatingChange = (type: 'overall' | 'design' | 'color', value: number) => {
        if (!isAuthenticated) {
            setSuccessMessage("Please log in to provide feedback");
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }
        setFormData(prev => ({
            ...prev,
            [`${type}Rating`]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setSuccessMessage("Please log in to submit feedback");
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }
        setIsSubmitting(true);
        try {
            // First check if feedback already exists in product_rating table
            const { data: existingFeedback, error: checkError } = await supabase
                .from('product_rating')
                .select('*')
                .eq('user_id', userId)
                .eq('product_id', productId)
                .single();

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
                throw checkError;
            }

            let result;
            if (existingFeedback) {
                // Update existing feedback
                result = await supabase
                    .from('product_rating')
                    .update({
                        overall_rating: formData.overallRating,
                        design_rating: formData.designRating,
                        color_rating: formData.colorRating,
                        comment: formData.comment,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', userId)
                    .eq('product_id', productId);
            } else {
                // Insert new feedback
                result = await supabase
                    .from('product_rating')
                    .insert([
                        {
                            user_id: userId,
                            product_id: productId,
                            overall_rating: formData.overallRating,
                            design_rating: formData.designRating,
                            color_rating: formData.colorRating,
                            comment: formData.comment
                        }
                    ]);
            }

            if (result.error) throw result.error;
            setSuccessMessage("Thanks for your feedback!");
            setTimeout(() => {
                setSuccessMessage('');
                onClose(); // Close the feedback form after successful submission
            }, 2000);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setSuccessMessage("Failed to submit feedback. Please try again.");
            setTimeout(() => setSuccessMessage(''), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full bg-black rounded-t-2xl max-h-[90vh] flex flex-col fixed bottom-0 left-0 right-0">
                <div className="w-full mb-[25px] flex items-center justify-between bg-[#1F1F1F] p-4 rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors"
                        aria-label="Close feedback form"
                    >
                        <X size={24} />
                    </button>
                    <h1 className="text-lg font-light tracking-wide text-center flex-1 text-gray-200">Feedback</h1>
                    <div className="w-[24px]"></div>
                </div>
                <div className="flex-1 flex items-center justify-center text-gray-200">
                    Loading...
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="w-full bg-black rounded-t-2xl max-h-[90vh] flex flex-col fixed bottom-0 left-0 right-0">
                <div className="w-full mb-[25px] flex items-center justify-between bg-[#1F1F1F] p-4 rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors"
                        aria-label="Close feedback form"
                    >
                        <X size={24} />
                    </button>
                    <h1 className="text-lg font-light tracking-wide text-center flex-1 text-gray-200">Feedback</h1>
                    <div className="w-[24px]"></div>
                </div>
                <div className="flex-1 flex items-center justify-center text-gray-200">
                    Please log in to provide feedback
                </div>
            </div>
        );
    }

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
                            <FeedbackRating 
                                rating={formData.overallRating}
                                onRatingChange={(value) => handleRatingChange('overall', value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 mb-[30px]">
                        <label className="block text-gray-400 text-sm">How do you feel about the design and styling of this piece?</label>
                        <div className="px-8">
                            <FeedbackRating 
                                rating={formData.designRating}
                                onRatingChange={(value) => handleRatingChange('design', value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 mb-[30px]">
                        <label className="block text-gray-400 text-sm">What's your take on the color, did it match your expectations?</label>
                        <div className="px-8">
                            <FeedbackRating 
                                rating={formData.colorRating}
                                onRatingChange={(value) => handleRatingChange('color', value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 mb-[30px]">
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            placeholder="Anything you'd like us to know?"
                            className="w-full h-[100px] p-3 rounded-none bg-black text-gray-200 tracking-wider text-xs placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-gray-500"
                        />
                    </div>
                </div>

                <div className="mt-[35px] flex flex-col items-center pb-1">
                    {successMessage && (
                        <div className={`mb-4 p-3 rounded text-center text-sm ${
                            successMessage.includes('Failed') || successMessage.includes('Error') || successMessage.includes('Please log in')
                                ? 'bg-red-100 text-red-700 border border-red-300' 
                                : 'bg-green-100 text-green-700 border border-green-300'
                        }`}>
                            {successMessage}
                        </div>
                    )}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-[180px] h-16 rounded-t-2xl bg-[#1F1F1F] hover:bg-gray-600 text-gray-200 text-base font-light tracking-wide font-[Boston] disabled:opacity-50"
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Feedback;