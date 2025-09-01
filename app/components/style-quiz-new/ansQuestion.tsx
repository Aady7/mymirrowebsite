'use client'

import React, { useState } from 'react'
import ProgressBar from './ProgressBar'
import QuizButton from './QuizButton'

export interface AnsQuestionData {
  answer: string
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
  const [selectedAnswer, setSelectedAnswer] = useState<string>(initialData?.answer || '')
  const [error, setError] = useState<string>('')

  const answers = [
    "I'm confident & bold",
    "I'm chill AF",
    "I'm polished & put-together",
    "I'm unpredictable, in a good way"
  ]

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    setError('')
  }

  const handleNext = () => {
    if (!selectedAnswer) {
      setError('Please select an answer to continue')
      return
    }

    onNext({
      answer: selectedAnswer
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
                  ${selectedAnswer === answer
                    ? 'border-black text-black'
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
          disabled={!selectedAnswer}
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
