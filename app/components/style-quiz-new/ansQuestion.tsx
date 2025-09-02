'use client'

import React, { useState } from 'react'
import ProgressBar from './ProgressBar'
import QuizButton from './QuizButton'

export interface AnsQuestionData {
  answers: string[]
}

interface AnsQuestionProps {
  onNext: (data: AnsQuestionData) => void
  onBack: () => void
  initialData?: AnsQuestionData
  currentStep: number
  totalSteps: number
}

const AnsQuestion: React.FC<AnsQuestionProps> = ({
  onNext,
  onBack,
  initialData,
  currentStep,
  totalSteps
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(initialData?.answers || [])
  const [error, setError] = useState<string>('')

  const answers = [
    "I'm confident & bold",
    "I'm chill AF",
    "I'm polished & put-together",
    "I'm unpredictable, in a good way"
  ]

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => {
      if (prev.includes(answer)) {
        // Remove if already selected
        return prev.filter(a => a !== answer)
      } else {
        // Add if not selected
        return [...prev, answer]
      }
    })
    setError('')
  }

  const handleNext = () => {
    if (selectedAnswers.length === 0) {
      setError('Please select at least one answer to continue')
      return
    }

    onNext({
      answers: selectedAnswers
    })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="px-6 pt-12 pb-4">
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={totalSteps}
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[26px] font-[700] leading-[100%] tracking-[-0.02em] text-black mb-3">
            When you dress, what are you saying to the world?
          </h1>
          <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-600 text-left">
            Select all that apply
          </p>
        </div>

        {/* Answer Options */}
        <div className="mb-8">
          <div className="space-y-4">
            {answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(answer)}
                className={`
                  w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                  ${selectedAnswers.includes(answer)
                    ? 'border-black text-black bg-gray-50'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }
                `}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <p className="text-red-500 text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-center">
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Footer with Continue Button */}
      <div className="px-6 pb-8 flex justify-center">
        <QuizButton
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={selectedAnswers.length === 0}
          className="w-full max-w-md"
        >
          Continue
        </QuizButton>
      </div>

      {/* Bottom Indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  )
}

export default AnsQuestion
