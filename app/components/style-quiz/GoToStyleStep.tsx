import React from 'react';
import { STYLE_IMAGES } from '@/app/utils/styleQuizUtils';

type StyleKey = keyof typeof STYLE_IMAGES;

interface GoToStyleStepProps {
    formValues: {
        goToStyle?: string[];
        gender?: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GoToStyleStep: React.FC<GoToStyleStepProps> = ({ formValues, handleChange }) => {
    return (
        <div>
            <label className="block text-[25px] text-gray-700 mb-4">What's your go-to style?</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['streetwear', 'business casual', 'athleisure'].map(style => (
                    <label key={style} className="flex flex-col items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="goToStyle"
                            value={style}
                            checked={formValues.goToStyle?.includes(style)}
                            onChange={handleChange}
                            className="hidden"
                        />
                        <div className={`w-full aspect-[3/4] border-2 rounded-lg overflow-hidden transition-all ${
                            formValues.goToStyle?.includes(style) ? 'border-[#007e90] shadow-lg' : 'border-gray-200'
                        }`}>
                            <img
                                src={STYLE_IMAGES[style as StyleKey][formValues.gender?.toLowerCase() === 'male' ? 'male' : 'female']}
                                alt={`${style} style`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className={`mt-2 py-2 px-4 rounded-lg text-center transition-all text-[14px] ${
                            formValues.goToStyle?.includes(style) ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700'
                        }`}>
                            {style.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default GoToStyleStep; 