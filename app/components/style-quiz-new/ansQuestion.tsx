'use client'

import React, { useState } from 'react'
import SingleViewportLayout from './SingleViewportLayout'

export interface AnsQuestionData {
  answers: string[]
}

interface AnsQuestionProps {
  onNext: (data: AnsQuestionData) => void
  onBack: () => void
  initialData?: AnsQuestionData
  currentStep: number
  totalSteps: number
  hasExtendedFlow?: boolean
}

const AnsQuestion: React.FC<AnsQuestionProps> = ({
  onNext,
  onBack,
  initialData,
  currentStep,
  totalSteps,
  hasExtendedFlow = false
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
    <SingleViewportLayout
      onNext={handleNext}
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isFormValid={selectedAnswers.length > 0}
      nextButtonText="Continue"
      showBackButton={currentStep > 1}
      hasExtendedFlow={hasExtendedFlow}
    >
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
    </SingleViewportLayout>
  )
}

export default AnsQuestion
