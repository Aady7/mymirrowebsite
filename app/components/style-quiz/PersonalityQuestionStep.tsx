import React from 'react';
import { PERSONALITY_QUESTIONS } from '@/app/utils/styleQuizUtils';
import { FormValues } from '@/app/data/stylequizInterface';

interface PersonalityQuestionStepProps {
    formValues: FormValues;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    questionIndex: number;
    onOptionSelect?: () => void;
}

const PersonalityQuestionStep: React.FC<PersonalityQuestionStepProps> = ({
    formValues,
    handleChange,
    questionIndex,
    onOptionSelect
}) => {
    const currentQuestion = PERSONALITY_QUESTIONS[questionIndex];
    
    // Find other questions in the same group
    const groupedQuestions = currentQuestion.group 
        ? PERSONALITY_QUESTIONS.filter(q => q.group === currentQuestion.group)
        : [currentQuestion];

    // Only show grouped questions if this is the first question of the group
    const shouldShowGroup = currentQuestion.group 
        ? PERSONALITY_QUESTIONS.findIndex(q => q.group === currentQuestion.group) === questionIndex
        : true;

    const handleOptionSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        // Check if all questions in the group are answered
        const allGroupQuestionsAnswered = groupedQuestions.every(q => formValues[q.key]);
        if (onOptionSelect && allGroupQuestionsAnswered) {
            setTimeout(onOptionSelect, 300);
        }
    };

    // Group titles mapping
   
    if (!shouldShowGroup) {
        return null; // Don't render anything if this isn't the first question of the group
    }

    return (
        <div className="space-y-8">
           
            
            <div className="space-y-10">
                {groupedQuestions.map((question, idx) => (
                    <div key={question.key} className={`space-y-6 ${idx > 0 ? 'pt-8 border-t border-gray-200' : ''}`}>
                        <label className="block text-[22px] text-gray-700 mb-6">{question.label}</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {question.options.map(option => (
                                <label key={option} className="flex items-center justify-center">
                                    <input
                                        type="radio"
                                        name={question.key}
                                        value={option}
                                        checked={formValues[question.key] === option}
                                        onChange={handleOptionSelect}
                                        className="hidden"
                                    />
                                    <div className={`w-full py-4 px-6 rounded-lg text-center cursor-pointer transition-all text-[14px] ${
                                        formValues[question.key] === option 
                                        ? 'bg-[#007e90] text-white shadow-md transform scale-[1.02]' 
                                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#007e90] hover:text-[#007e90]'
                                    }`}>
                                        {option}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PersonalityQuestionStep; 