"use client";
import Feedback from "@/app/components/feedback"; // Adjust the path if needed
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface FeedbackButtonProps {
    productId: number;
}

const FeedbackButton = ({ productId }: FeedbackButtonProps) => {
    const [showFeedback, setShowFeedback] = useState(false);
    
    return (
        <>
         <div className="flex justify-center items-center w-full">
            <Button
                onClick={() => setShowFeedback(true)}
                className="rounded text-sm bg-[#007e90] hover:bg-[#006d7d] text-white px-6 py-3 whitespace-nowrap transition-colors"
            >
                Give Feedback
            </Button>
         </div>
        {showFeedback && (
            <div className="fixed inset-0 z-50 flex items-end justify-center  bg-opacity-40">
              <div
                className="w-full max-w-md   rounded-t-2xl shadow-lg p-0"
                style={{
                  height: "80vh",
                  animation: "slideUp 1.5s ease"
                }}
              >
                
                <Feedback onClose={() => setShowFeedback(false)} productId={productId} />
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
          )}
          </>
    )
}

export default FeedbackButton;