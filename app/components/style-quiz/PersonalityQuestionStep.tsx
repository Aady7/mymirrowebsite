import React from 'react';
import { PERSONALITY_QUESTIONS } from '@/app/utils/styleQuizUtils';

interface PersonalityQuestionStepProps {
    formValues: {
        [key: string]: any;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    questionIndex: number;
}

const PersonalityQuestionStep: React.FC<PersonalityQuestionStepProps> = ({
    formValues,
    handleChange,
    questionIndex
}) => {
    const question = PERSONALITY_QUESTIONS[questionIndex];

    return (
        <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-4">{question.label}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map(option => (
                    <label key={option} className="flex items-center justify-center">
                        <input
                            type="radio"
                            name={question.key}
                            value={option}
                            checked={formValues[question.key] === option}
                            onChange={handleChange}
                            className="hidden"
                        />
                        <div className={`w-full py-3 px-4 rounded-lg text-center cursor-pointer transition-all text-sm md:text-base ${formValues[question.key] === option
                            ? 'bg-[#007e90] text-white'
                            : 'bg-white text-gray-700 border-2 border-gray-200'
                            }`}>
                            {option}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default PersonalityQuestionStep; 