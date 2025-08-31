"use client";
import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import QuizButton from './QuizButton';

interface PersonalInfoProps {
  onNext?: (data: PersonalInfoData) => void;
  onBack?: () => void;
  initialData?: Partial<PersonalInfoData>;
  currentStep?: number;
  totalSteps?: number;
}

export interface PersonalInfoData {
  name: string;
  gender: 'Female' | 'Male' | 'Other' | '';
  age: '<18' | '18-25' | '26-35' | '36-45' | '';
  occupation: 'Student' | 'Working Professional' | 'Creative' | 'Enterpreneur' | 'Athlete' | 'Other' | '';
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  onNext,
  onBack,
  initialData,
  currentStep = 1,
  totalSteps = 8
}) => {
  const [formData, setFormData] = useState<PersonalInfoData>({
    name: initialData?.name || '',
    gender: initialData?.gender || '',
    age: initialData?.age || '',
    occupation: initialData?.occupation || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, name: value }));
    
    // Clear error when user starts typing
    if (errors.name && value.trim()) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleGenderSelect = (gender: PersonalInfoData['gender']) => {
    setFormData(prev => ({ ...prev, gender }));
    if (errors.gender) {
      setErrors(prev => ({ ...prev, gender: '' }));
    }
  };

  const handleAgeSelect = (age: PersonalInfoData['age']) => {
    setFormData(prev => ({ ...prev, age }));
    if (errors.age) {
      setErrors(prev => ({ ...prev, age: '' }));
    }
  };

  const handleOccupationSelect = (occupation: PersonalInfoData['occupation']) => {
    setFormData(prev => ({ ...prev, occupation }));
    if (errors.occupation) {
      setErrors(prev => ({ ...prev, occupation: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.age) {
      newErrors.age = 'Please select your age range';
    }

    if (!formData.occupation) {
      newErrors.occupation = 'Please select your occupation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onNext?.(formData);
    }
  };

  const isFormValid = formData.name.trim() && formData.gender && formData.age && formData.occupation;

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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">
            Hey there, Style Icon!
          </h1>
          <p className="text-gray-600 text-base">
            Start by telling us a bit about you.
          </p>
        </div>

        {/* Name Input */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="What should we call you?"
              value={formData.name}
              onChange={handleNameChange}
              className={`w-full border-b-2 pb-2 text-base placeholder-gray-400 bg-transparent focus:outline-none transition-colors ${
                errors.name 
                  ? 'border-red-500 text-red-600' 
                  : formData.name.trim() 
                    ? 'border-black text-black' 
                    : 'border-gray-300 text-gray-700 focus:border-gray-500'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Gender Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-black mb-4">Gender</h2>
          <div className="flex flex-wrap gap-3">
            <QuizButton
              selected={formData.gender === 'Female'}
              onClick={() => handleGenderSelect('Female')}
            >
              Female
            </QuizButton>
            <QuizButton
              selected={formData.gender === 'Male'}
              onClick={() => handleGenderSelect('Male')}
            >
              Male
            </QuizButton>
            <QuizButton
              selected={formData.gender === 'Other'}
              onClick={() => handleGenderSelect('Other')}
            >
              Other
            </QuizButton>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-2">{errors.gender}</p>
          )}
        </div>

        {/* Age Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-black mb-4">Age</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuizButton
              selected={formData.age === '<18'}
              onClick={() => handleAgeSelect('<18')}
            >
              &lt;18
            </QuizButton>
            <QuizButton
              selected={formData.age === '18-25'}
              onClick={() => handleAgeSelect('18-25')}
            >
              18-25
            </QuizButton>
            <QuizButton
              selected={formData.age === '26-35'}
              onClick={() => handleAgeSelect('26-35')}
            >
              26-35
            </QuizButton>
            <QuizButton
              selected={formData.age === '36-45'}
              onClick={() => handleAgeSelect('36-45')}
            >
              36-45
            </QuizButton>
          </div>
          {errors.age && (
            <p className="text-red-500 text-sm mt-2">{errors.age}</p>
          )}
        </div>

        {/* Occupation Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-black mb-4">Occupation</h2>
          <div className="flex flex-wrap gap-3">
            <QuizButton
              selected={formData.occupation === 'Student'}
              onClick={() => handleOccupationSelect('Student')}
            >
              Student
            </QuizButton>
            <QuizButton
              selected={formData.occupation === 'Working Professional'}
              onClick={() => handleOccupationSelect('Working Professional')}
            >
              Working Professional
            </QuizButton>
            <QuizButton
              selected={formData.occupation === 'Creative'}
              onClick={() => handleOccupationSelect('Creative')}
            >
              Creative
            </QuizButton>
            <QuizButton
              selected={formData.occupation === 'Enterpreneur'}
              onClick={() => handleOccupationSelect('Enterpreneur')}
            >
              Enterpreneur
            </QuizButton>
            <QuizButton
              selected={formData.occupation === 'Athlete'}
              onClick={() => handleOccupationSelect('Athlete')}
            >
              Athlete
            </QuizButton>
            <QuizButton
              selected={formData.occupation === 'Other'}
              onClick={() => handleOccupationSelect('Other')}
            >
              Other
            </QuizButton>
          </div>
          {errors.occupation && (
            <p className="text-red-500 text-sm mt-2">{errors.occupation}</p>
          )}
        </div>
      </div>

      {/* Footer with Continue Button */}
      <div className="px-6 pb-8">
        <QuizButton
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={!isFormValid}
          className="w-full"
        >
          Continue
        </QuizButton>
      </div>

      {/* Bottom Indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default PersonalInfo;
