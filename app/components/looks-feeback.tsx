"use client";

import React, { useEffect, useState } from "react";
import StarRating from "./starRating";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LooksFeedbackProps {
    onClose: () => void;
    userId: string;
    lookId: number;
}

const Looksfeeback: React.FC<LooksFeedbackProps> = ({ onClose, userId, lookId }) => {
    const [formData, setFormData] = useState({
        comment: ""
    });

    const [show, setShow] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log("Form submitted:", formData);
    };

    return (
        <>
            <button onClick={() => setShow(true)} className="rounded-none text-sm font-extralight bg-black text-white h-10 w-30 font-[Boston]">
                Give Feedback
            </button>
            {show && (

                <div className="fixed inset-0 z-50 flex items-end justify-center  bg-opacity-40">
                    <div
                        className="w-full max-w-md   rounded-t-2xl shadow-lg p-0"
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

                            <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 py-3 overflow-y-auto">
                                <div className="space-y-4 flex-1 px-[20px]">
                                    <div className="space-y-2 mb-[30px]">
                                        <label className="block text-gray-400 text-sm"> Did these outfit suggestions feel fresh and exciting to you?</label>
                                        <div className="px-8">
                                            <StarRating userId={userId} lookId={lookId} />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-[30px]">
                                        <label className="block text-gray-400 text-sm"> Do these recommendations match your personal style, in terms of color, fit, and design?</label>
                                        <div className="px-8">
                                            <StarRating userId={userId} lookId={lookId} />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-[30px]">
                                        <label className="block text-gray-400 text-sm"> Are you happy with the variety of looks shown here? </label>
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

export default Looksfeeback;