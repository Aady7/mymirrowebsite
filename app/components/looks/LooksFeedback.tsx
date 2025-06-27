"use client";

import React, { useEffect, useState } from "react";
import StarRating from "../starRating";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FeedbackRating from "../feedbackRating";

interface LooksFeedbackProps {
    onClose: () => void;
    userId: string;
    lookId: string | number;
}

const LooksFeedback: React.FC<LooksFeedbackProps> = ({ onClose, userId, lookId }) => {
    console.log('🔍 LooksFeedback props:', { userId, lookId, lookIdType: typeof lookId });
    
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState({
        freshnessRating: 0,
        styleMatchRating: 0,
        varietyRating: 0,
        comment: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setCurrentUserId(user.id);
                    setIsAuthenticated(true);
                    
                    // Fetch existing feedback only if lookId is valid
                    if (lookId && (typeof lookId === 'string' || !isNaN(lookId))) {
                        const { data: feedbackData, error } = await supabase
                            .from('outfit_rating')
                            .select('*')
                            .eq('user_id', user.id)
                            .eq('outfit_id', lookId)
                            .single();

                        if (feedbackData) {
                            setFormData({
                                freshnessRating: feedbackData.freshness_rating || 0,
                                styleMatchRating: feedbackData.style_match_rating || 0,
                                varietyRating: feedbackData.variety_rating || 0,
                                comment: feedbackData.comment || ""
                            });
                        }
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
    }, [lookId]);

    const handleRatingChange = (type: 'freshness' | 'styleMatch' | 'variety', value: number) => {
        if (!isAuthenticated) {
            alert("Please log in to provide feedback");
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
            alert("Please log in to submit feedback");
            return;
        }
        
        // Validate lookId (can be string or number)
        if (!lookId || (typeof lookId === 'string' && lookId.trim() === '') || (typeof lookId === 'number' && isNaN(lookId))) {
            console.error('❌ Invalid lookId:', lookId);
            alert("Invalid outfit ID. Please try refreshing the page.");
            return;
        }
        
        if (!currentUserId) {
            console.error('❌ No currentUserId available');
            alert("User ID not available. Please try logging in again.");
            return;
        }
        
        setIsSubmitting(true);
        try {
            // Check if feedback already exists to preserve existing data (like the overall rating from StarRating)
            const { data: existingFeedback, error: checkError } = await supabase
                .from('outfit_rating')
                .select('*')
                .eq('user_id', currentUserId)
                .eq('outfit_id', lookId)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                throw checkError;
            }

            if (existingFeedback) {
                // Update existing feedback while preserving other fields like 'rating'
                console.log('📝 Updating existing feedback while preserving other data');
                const { error: updateError } = await supabase
                    .from('outfit_rating')
                    .update({
                        freshness_rating: formData.freshnessRating,
                        style_match_rating: formData.styleMatchRating,
                        variety_rating: formData.varietyRating,
                        comment: formData.comment,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', currentUserId)
                    .eq('outfit_id', lookId);

                if (updateError) throw updateError;
            } else {
                // Insert new feedback
                console.log('📝 Inserting new feedback with data:', {
                    user_id: currentUserId,
                    outfit_id: lookId,
                    freshness_rating: formData.freshnessRating,
                    style_match_rating: formData.styleMatchRating,
                    variety_rating: formData.varietyRating,
                    comment: formData.comment
                });
                
                const { error: insertError } = await supabase
                    .from('outfit_rating')
                    .insert([
                        {
                            user_id: currentUserId,
                            outfit_id: lookId,
                            freshness_rating: formData.freshnessRating,
                            style_match_rating: formData.styleMatchRating,
                            variety_rating: formData.varietyRating,
                            comment: formData.comment
                        }
                    ]);

                if (insertError) throw insertError;
            }
            
            setSuccessMessage("Thanks for your feedback!");
            setTimeout(() => {
                setSuccessMessage('');
                setShow(false);
                onClose();
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
            <>
                <button onClick={() => setShow(true)} className="rounded text-sm bg-[#007e90] hover:bg-[#006d7d] text-white px-6 py-3 whitespace-nowrap transition-colors">
                    Give Feedback
                </button>
                {show && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center bg-opacity-40">
                        <div className="w-full bg-black rounded-t-2xl max-h-[90vh] flex flex-col fixed bottom-0 left-0 right-0">
                            <div className="flex-1 flex items-center justify-center text-gray-200">
                                Loading...
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <button onClick={() => setShow(true)} className="rounded text-sm bg-[#007e90] hover:bg-[#006d7d] text-white px-6 py-3 whitespace-nowrap transition-colors">
                Give Feedback
            </button>
            {show && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-opacity-40">
                    <div
                        className="w-full max-w-md rounded-t-2xl shadow-lg p-0"
                        style={{
                            height: "80vh",
                            animation: "slideUp 1.5s ease"
                        }}
                    >
                        <div className="w-full bg-black rounded-t-2xl max-h-[90vh] flex flex-col fixed bottom-0 left-0 right-0">
                            <div className="w-full mb-[25px] flex items-center justify-between bg-[#1F1F1F] p-4 rounded-t-2xl">
                                <button
                                    onClick={() => {
                                        setShow(false);
                                        onClose();
                                    }}
                                    className="text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Close feedback form"
                                >
                                    <X size={24} />
                                </button>
                                <h1 className="text-lg font-light tracking-wide text-center flex-1 text-gray-200">Feedback</h1>
                                <div className="w-[24px]"></div>
                            </div>

                            {!isAuthenticated ? (
                                <div className="flex-1 flex items-center justify-center text-gray-200">
                                    Please log in to provide feedback
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 py-3 overflow-y-auto">
                                    <div className="space-y-4 flex-1 px-[20px]">
                                        <div className="space-y-2 mb-[30px]">
                                            <label className="block text-gray-400 text-sm">Did these outfit suggestions feel fresh and exciting to you?</label>
                                            <div className="px-8">
                                                <FeedbackRating 
                                                    rating={formData.freshnessRating}
                                                    onRatingChange={(value) => handleRatingChange('freshness', value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-[30px]">
                                            <label className="block text-gray-400 text-sm">Do these recommendations match your personal style, in terms of color, fit, and design?</label>
                                            <div className="px-8">
                                                <FeedbackRating 
                                                    rating={formData.styleMatchRating}
                                                    onRatingChange={(value) => handleRatingChange('styleMatch', value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-[30px]">
                                            <label className="block text-gray-400 text-sm">Are you happy with the variety of looks shown here?</label>
                                            <div className="px-8">
                                                <FeedbackRating 
                                                    rating={formData.varietyRating}
                                                    onRatingChange={(value) => handleRatingChange('variety', value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-[30px]">
                                            <textarea
                                                name="comment"
                                                value={formData.comment}
                                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                                placeholder="Anything you'd like us to know?"
                                                className="w-full h-[100px] p-3 rounded bg-black text-gray-200 tracking-wider text-xs placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-gray-500"
                                            />
                                        </div>
                                    </div>

                                                        <div className="mt-[35px] flex flex-col items-center pb-1">
                        {successMessage && (
                            <div className={`mb-4 p-3 rounded text-center text-sm ${
                                successMessage.includes('Failed') || successMessage.includes('Error') 
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
                            )}
                        </div>

                        <style jsx global>{`
                            @keyframes slideUp {
                                from {
                                    transform: translateY(100%);
                                }
                                to {
                                    transform: translateY(0);
                                }
                            }
                        `}</style>
                    </div>
                </div>
            )}
        </>
    );
}

export default LooksFeedback;