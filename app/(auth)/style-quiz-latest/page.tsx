"use client";
import React, { useState } from 'react';
import PersonalInfo, { PersonalInfoData } from '@/app/components/style-quiz-new/personalInfo';
import BodyType, { BodyTypeData } from '@/app/components/style-quiz-new/bodytype';
import ColorAnalysis, { ColorAnalysisData } from '@/app/components/style-quiz-new/colorAnalysis';
import StyleOrigin, { StyleOriginData } from '@/app/components/style-quiz-new/styleorigin';
import StyleVibe, { StyleVibeData } from '@/app/components/style-quiz-new/styleVibe';
import ContactVerification, { ContactVerificationData } from '@/app/components/style-quiz-new/contactVerification';
import OtpVerification, { OtpVerificationData } from '@/app/components/style-quiz-new/otpVerification';

interface StyleQuizState {
  currentStep: number;
  personalInfo: PersonalInfoData | null;
  bodyType: BodyTypeData | null;
  colorAnalysis: ColorAnalysisData | null;
  styleOrigin: StyleOriginData | null;
  styleVibe: StyleVibeData | null;
  contactVerification: ContactVerificationData | null;
  otpVerification: OtpVerificationData | null;
  // Add more steps as needed
}

const StyleQuizPages = () => {
  const [quizState, setQuizState] = useState<StyleQuizState>({
    currentStep: 1,
    personalInfo: null,
    bodyType: null,
    colorAnalysis: null,
    styleOrigin: null,
    styleVibe: null,
    contactVerification: null,
    otpVerification: null,
  });

  const totalSteps = 7;

  const handlePersonalInfoNext = (data: PersonalInfoData) => {
    console.log('Personal Info Data:', data);
    setQuizState(prev => ({
      ...prev,
      personalInfo: data,
      currentStep: prev.currentStep + 1
    }));
  };

  const handleBodyTypeNext = (data: BodyTypeData) => {
    console.log('Body Type Data:', data);
    setQuizState(prev => ({
      ...prev,
      bodyType: data,
      currentStep: prev.currentStep + 1
    }));
  };

  const handleColorAnalysisNext = (data: ColorAnalysisData) => {
    console.log('Color Analysis Data:', data);
    setQuizState(prev => ({
      ...prev,
      colorAnalysis: data,
      currentStep: prev.currentStep + 1
    }));
  };

  const handleStyleOriginNext = (data: StyleOriginData) => {
    console.log('Style Origin Data:', data);
    setQuizState(prev => ({
      ...prev,
      styleOrigin: data,
      currentStep: prev.currentStep + 1
    }));
  };

  const handleStyleVibeNext = (data: StyleVibeData) => {
    console.log('Style Vibe Data:', data);
    setQuizState(prev => ({
      ...prev,
      styleVibe: data,
      currentStep: prev.currentStep + 1
    }));
  };

  const handleContactVerificationNext = (data: ContactVerificationData) => {
    console.log('Contact Verification Data:', data);
    setQuizState(prev => ({
      ...prev,
      contactVerification: data,
      currentStep: prev.currentStep + 1
    }));
  };

  const handleOtpVerificationNext = (data: OtpVerificationData) => {
    console.log('OTP Verification Data:', data);
    setQuizState(prev => ({
      ...prev,
      otpVerification: data,
      currentStep: prev.currentStep + 1
    }));
  };

  const handleBack = () => {
    setQuizState(prev => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1)
    }));
  };

  const renderCurrentStep = () => {
    switch (quizState.currentStep) {
      case 1:
        return (
          <PersonalInfo
            onNext={handlePersonalInfoNext}
            onBack={handleBack}
            initialData={quizState.personalInfo || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
          />
        );
      
      case 2:
        return (
          <BodyType
            onNext={handleBodyTypeNext}
            onBack={handleBack}
            initialData={quizState.bodyType || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            gender={quizState.personalInfo?.gender || ''}
          />
        );
      
      case 3:
        return (
          <ColorAnalysis
            onNext={handleColorAnalysisNext}
            onBack={handleBack}
            initialData={quizState.colorAnalysis || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
          />
        );
      
      case 4:
        return (
          <StyleOrigin
            onNext={handleStyleOriginNext}
            onBack={handleBack}
            initialData={quizState.styleOrigin || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            gender={quizState.personalInfo?.gender || ''}
          />
        );
      
      case 5:
        return (
          <StyleVibe
            onNext={handleStyleVibeNext}
            onBack={handleBack}
            initialData={quizState.styleVibe || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            gender={quizState.personalInfo?.gender || ''}
          />
        );
      
      case 6:
        return (
          <ContactVerification
            onNext={handleContactVerificationNext}
            onBack={handleBack}
            initialData={quizState.contactVerification || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
          />
        );
      
      case 7:
        return (
          <OtpVerification
            onNext={handleOtpVerificationNext}
            onBack={handleBack}
            initialData={quizState.otpVerification || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
            email={quizState.contactVerification?.email || ''}
            phone={quizState.contactVerification?.phone || ''}
            allQuizData={quizState}
          />
        );
      
      default:
        return (
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Step {quizState.currentStep} Coming Soon
              </h2>
              <p className="text-gray-600 mb-6">
                This step is under development
              </p>
              <button
                onClick={handleBack}
                className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderCurrentStep()}
    </div>
  );
};

export default StyleQuizPages;
