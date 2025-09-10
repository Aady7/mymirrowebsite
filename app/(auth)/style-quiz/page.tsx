"use client";
import React, { useState, useEffect } from 'react';
import PersonalInfo, { PersonalInfoData } from '@/app/components/style-quiz-new/personalInfo';
import BodyType, { BodyTypeData } from '@/app/components/style-quiz-new/bodytype';
import ColorAnalysis, { ColorAnalysisData } from '@/app/components/style-quiz-new/colorAnalysis';
import StyleOrigin, { StyleOriginData } from '@/app/components/style-quiz-new/styleorigin';
import StyleVibe, { StyleVibeData } from '@/app/components/style-quiz-new/styleVibe';
import AnsQuestion, { AnsQuestionData } from '@/app/components/style-quiz-new/ansQuestion';
import OutfitSwipe, { SwipeResultData } from '@/app/components/style-quiz-new/outfitSwipe';
import ContactVerification, { ContactVerificationData } from '@/app/components/style-quiz-new/contactVerification';
import OtpVerification, { OtpVerificationData } from '@/app/components/style-quiz-new/otpVerification';
import { storeQuizDataLocally, getQuizDataFromStorage } from '@/app/utils/styleQuizUtils';

interface StyleQuizState {
  currentStep: number;
  personalInfo: PersonalInfoData | null;
  bodyType: BodyTypeData | null;
  colorAnalysis: ColorAnalysisData | null;
  styleOrigin: StyleOriginData | null;
  styleVibe: StyleVibeData | null;
  ansQuestion: AnsQuestionData | null;
  outfitSwipe: SwipeResultData | null;
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
    ansQuestion: null,
    outfitSwipe: null,
    contactVerification: null,
    otpVerification: null,
  });

  // Load quiz data from local storage on component mount
  useEffect(() => {
    const savedData = getQuizDataFromStorage();
    if (savedData) {
      setQuizState(savedData);
      console.log('Loaded quiz data from local storage:', savedData);
    }
  }, []);

  // Save quiz data to local storage whenever quiz state changes
  useEffect(() => {
    // Only save if we have some data (not initial empty state)
    if (quizState.personalInfo || quizState.bodyType || quizState.colorAnalysis) {
      storeQuizDataLocally(quizState);
    }
  }, [quizState]);

  // Calculate total steps based on whether user selected trend-focused
  const getTotalSteps = () => {
    if (quizState.styleOrigin?.styleOrigin === 'trend-focused') {
      return 7; // PersonalInfo(1) -> BodyType(2) -> ColorAnalysis(3) -> StyleOrigin(4) -> OutfitSwipe(5) -> ContactVerification(6) -> OtpVerification(7)
    }
    return 9; // Include all steps including outfitSwipe
  };

  const totalSteps = getTotalSteps();

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
    
    // Always go to the next step, but the conditional logic in renderCurrentStep
    // will determine what component to show based on styleOrigin selection
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

  const handleAnsQuestionNext = (data: AnsQuestionData) => {
    console.log('Ans Question Data:', data);
    setQuizState(prev => ({
      ...prev,
      ansQuestion: data,
      currentStep: prev.currentStep + 1
    }));
  };

  const handleOutfitSwipeNext = (data: SwipeResultData) => {
    console.log('Outfit Swipe Data:', data);
    setQuizState(prev => ({
      ...prev,
      outfitSwipe: data,
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
    setQuizState(prev => {
      let newStep = Math.max(1, prev.currentStep - 1);
      
      // Handle back navigation for trend-focused users
      if (prev.styleOrigin?.styleOrigin === 'trend-focused') {
        if (prev.currentStep === 5) { // outfit swipe step
          newStep = 4; // Go back to styleOrigin
        } else if (prev.currentStep === 6) { // contact verification step
          newStep = 5; // Go back to outfit swipe
        } else if (prev.currentStep === 7) { // otp verification step
          newStep = 6; // Go back to contact verification
        }
      }
      
      return {
        ...prev,
        currentStep: newStep
      };
    });
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
        // Check if trend-focused (outfit swipe) or styleVibe for regular flow
        if (quizState.styleOrigin?.styleOrigin === 'trend-focused') {
          return (
            <OutfitSwipe
              onNext={handleOutfitSwipeNext}
              onBack={handleBack}
              currentStep={quizState.currentStep}
              totalSteps={totalSteps}
              gender={quizState.personalInfo?.gender || 'Male'}
            />
          );
        } else {
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
        }
      
      case 6:
        // Check if trend-focused (contact verification) or ansQuestion
        if (quizState.styleOrigin?.styleOrigin === 'trend-focused') {
          return (
            <ContactVerification
              onNext={handleContactVerificationNext}
              onBack={handleBack}
              initialData={quizState.contactVerification || undefined}
              currentStep={quizState.currentStep}
              totalSteps={totalSteps}
            />
          );
        } else {
          return (
            <AnsQuestion
              onNext={handleAnsQuestionNext}
              onBack={handleBack}
              initialData={quizState.ansQuestion || undefined}
              currentStep={quizState.currentStep}
              totalSteps={totalSteps}
            />
          );
        }
      
      case 7:
        // Check if trend-focused (OTP verification) or outfit swipe
        if (quizState.styleOrigin?.styleOrigin === 'trend-focused') {
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
              isLatestVersion={true}
            />
          );
        } else {
          return (
            <OutfitSwipe
              onNext={handleOutfitSwipeNext}
              onBack={handleBack}
              currentStep={quizState.currentStep}
              totalSteps={totalSteps}
              gender={quizState.personalInfo?.gender || 'Male'}
            />
          );
        }
      
      case 8:
        // Contact Verification step (only for non-trend-focused users)
        return (
          <ContactVerification
            onNext={handleContactVerificationNext}
            onBack={handleBack}
            initialData={quizState.contactVerification || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
          />
        );
      
      case 9:
        // OTP Verification step (only for non-trend-focused users)
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
            isLatestVersion={true}
          />
        );
      
      default:
        return (
          <PersonalInfo
            onNext={handlePersonalInfoNext}
            onBack={handleBack}
            initialData={quizState.personalInfo || undefined}
            currentStep={quizState.currentStep}
            totalSteps={totalSteps}
          />
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
