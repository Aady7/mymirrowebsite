"use client";
import React, { useState } from 'react';
import SingleViewportLayout from './SingleViewportLayout';

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
    <SingleViewportLayout
      onNext={handleContinue}
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isFormValid={isFormValid}
      nextButtonText="Continue"
      showBackButton={currentStep > 1}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[26px] font-[700] leading-[100%] tracking-[-0.02em] text-black mb-3">
          Hey there, Style Icon!
        </h1>
        <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-600 text-left">
          Start by telling us a bit about you.
        </p>
      </div>

      {/* Questions Container */}
      <div className="flex flex-col items-start gap-[25px] self-stretch">
        {/* Name Input */}
        <div className="w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="What should we call you?"
              value={formData.name}
              onChange={handleNameChange}
              className={`w-full border-b-2 pb-2 text-[14px] font-[400] leading-[100%] tracking-[-0.02em] placeholder-gray-400 bg-transparent focus:outline-none transition-colors ${
                errors.name 
                  ? 'border-red-500 text-red-600' 
                  : formData.name.trim() 
                    ? 'border-black text-black' 
                    : 'border-gray-300 text-gray-700 focus:border-gray-500'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-[12px] font-[400] leading-[100%] tracking-[-0.02em] mt-1">{errors.name}</p>
            )}
          </div>
        </div>

          {/* Gender Selection */}
          <div className="w-full">
            <h2 className="text-[18px] font-[600] leading-[100%] tracking-[-0.02em] text-black mb-4">Gender</h2>
            <div className="flex flex-wrap gap-[10px]">
              <button
                onClick={() => handleGenderSelect('Female')}
                className={`
                  h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                  ${formData.gender === 'Female' 
                    ? 'border-black text-black hover:border-black' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }
                `}
              >
                Female
              </button>
              <button
                onClick={() => handleGenderSelect('Male')}
                className={`
                  h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                  ${formData.gender === 'Male' 
                    ? 'border-black text-black' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }
                `}
              >
                Male
              </button>
              <button
                onClick={() => handleGenderSelect('Other')}
                className={`
                  h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                  ${formData.gender === 'Other' 
                    ? 'border-black text-black' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }
                `}
              >
                Other
              </button>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-[14px] font-[400] leading-[100%] tracking-[-0.02em] mt-2">{errors.gender}</p>
            )}
          </div>

        {/* Age Selection */}
        <div className="w-full">
          <h2 className="text-[18px] font-[600] leading-[100%] tracking-[-0.02em] text-black mb-4">Age</h2>
          <div className="grid grid-cols-3 gap-[10px]">
            <button
              onClick={() => handleAgeSelect('<18')}
              className={`
                h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                ${formData.age === '<18' 
                  ? 'border-black text-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              &lt;18
            </button>
            <button
              onClick={() => handleAgeSelect('18-25')}
              className={`
                h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                ${formData.age === '18-25' 
                  ? 'border-black text-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              18-25
            </button>
            <button
              onClick={() => handleAgeSelect('26-35')}
              className={`
                h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                ${formData.age === '26-35' 
                  ? 'border-black text-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              26-35
            </button>
            <button
              onClick={() => handleAgeSelect('36-45')}
              className={`
                h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                ${formData.age === '36-45' 
                  ? 'border-black text-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              36-45
            </button>
          </div>
          {errors.age && (
            <p className="text-red-500 text-[14px] font-[400] leading-[100%] tracking-[-0.02em] mt-2">{errors.age}</p>
          )}
        </div>

        {/* Occupation Selection */}
        <div className="w-full">
          <h2 className="text-[18px] font-[600] leading-[100%] tracking-[-0.02em] text-black mb-4">Occupation</h2>
          <div className="flex flex-wrap gap-[10px]">
            <button
              onClick={() => handleOccupationSelect('Student')}
              className={`
                h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                ${formData.occupation === 'Student' 
                  ? 'border-black text-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              Student
            </button>
            <button
              onClick={() => handleOccupationSelect('Working Professional')}
              className={`
                h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                ${formData.occupation === 'Working Professional' 
                  ? 'border-black text-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              Working Professional
            </button>
            <button
              onClick={() => handleOccupationSelect('Creative')}
              className={`
                h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                ${formData.occupation === 'Creative' 
                  ? 'border-black text-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              Creative
            </button>
            <button
              onClick={() => handleOccupationSelect('Enterpreneur')}
              className={`
                h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                ${formData.occupation === 'Enterpreneur' 
                  ? 'border-black text-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              Enterpreneur
            </button>
            <button
              onClick={() => handleOccupationSelect('Athlete')}
              className={`
                h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                ${formData.occupation === 'Athlete' 
                  ? 'border-black text-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              Athlete
            </button>
            <button
              onClick={() => handleOccupationSelect('Other')}
              className={`
                h-[30px] px-[10px] border rounded-[5px] transition-all duration-200 text-[14px] font-[600] leading-[100%] tracking-[-0.02em] text-center
                ${formData.occupation === 'Other' 
                  ? 'border-black text-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              Other
            </button>
          </div>
          {errors.occupation && (
            <p className="text-red-500 text-[14px] font-[400] leading-[100%] tracking-[-0.02em] mt-2">{errors.occupation}</p>
          )}
        </div>
      </div>
    </SingleViewportLayout>
  );
};

export default PersonalInfo;
