"use client";
import Feedback from "@/app/components/feedback"; // Adjust the path if needed
import { useState } from "react";

const FeedbackButton = () => {
    const [showFeedback, setShowFeedback] = useState(false);
    
    return (
        <>
         <button   onClick={() => setShowFeedback(true)} className="rounded-none text-sm font-extralight bg-black text-white h-10 w-30 font-[Boston]">
      Give Feedback
    </button>
        {showFeedback && (
            <div className="fixed inset-0 z-50 flex items-end justify-center  bg-opacity-40">
              <div
                className="w-full max-w-md   rounded-t-2xl shadow-lg p-0"
                style={{
                  height: "80vh",
                  animation: "slideUp 1.5s ease"
                }}
              >
                
                <Feedback onClose={() => setShowFeedback(false)} />
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