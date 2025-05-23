import React from 'react';
import { SIZE_OPTIONS } from '@/app/utils/styleQuizUtils';

interface SizePreferencesStepProps {
    formValues: {
        upperWear?: string;
        waistSize?: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SizePreferencesStep: React.FC<SizePreferencesStepProps> = ({ formValues, handleChange }) => {
    return (
        <div className="space-y-8">
            <div>
                <label className="block text-[25px] text-gray-700 mb-4">What size upper-wear do you prefer?</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {SIZE_OPTIONS.upperWear.map(size => (
                        <label key={size} className="flex items-center justify-center">
                            <input
                                type="radio"
                                name="upperWear"
                                value={size}
                                checked={formValues.upperWear === size}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer transition-all text-[14px] ${formValues.upperWear === size ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                                }`}>
                                {size}
                            </div>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-[25px] text-gray-700 mb-4">What waist size do you prefer to wear?</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {SIZE_OPTIONS.waistSize.map(size => (
                        <label key={size} className="flex items-center justify-center">
                            <input
                                type="radio"
                                name="waistSize"
                                value={size}
                                checked={formValues.waistSize === size}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer transition-all text-[14px] ${formValues.waistSize === size ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                                }`}>
                                {size}
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SizePreferencesStep; 