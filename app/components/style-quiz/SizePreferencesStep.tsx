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
                <label className="block text-sm font-medium text-gray-700 mb-4">Upper Wear Size</label>
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
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer transition-all ${formValues.upperWear === size ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                                }`}>
                                {size}
                            </div>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Waist Size</label>
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
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer transition-all ${formValues.waistSize === size ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
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