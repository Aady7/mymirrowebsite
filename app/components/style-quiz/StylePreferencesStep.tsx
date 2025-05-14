import React from 'react';

interface StylePreferencesStepProps {
    formValues: {
        outfitAdventurous?: string[];
        minimalistic?: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StylePreferencesStep: React.FC<StylePreferencesStepProps> = ({ formValues, handleChange }) => {
    return (
        <div className="space-y-8">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">How adventurous are you with your outfits?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['I stick with my go‑to styles', 'I try new look sometimes', 'I love bold, unique fashion'].map(level => (
                        <label key={level} className="flex items-center justify-center">
                            <input
                                type="checkbox"
                                name="outfitAdventurous"
                                value={level}
                                checked={formValues.outfitAdventurous?.includes(level)}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <div className={`w-full py-3 px-4 rounded-lg text-center cursor-pointer transition-all ${formValues.outfitAdventurous?.includes(level) ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                                }`}>
                                {level}
                            </div>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Do you prefer minimalistic style?</label>
                <div className="grid grid-cols-2 gap-4">
                    {['Yes', 'No'].map(option => (
                        <label key={option} className="flex items-center justify-center">
                            <input
                                type="radio"
                                name="minimalistic"
                                value={option}
                                checked={formValues.minimalistic === option}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <div className={`w-full py-3 px-4 rounded-lg text-center cursor-pointer transition-all ${formValues.minimalistic === option ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                                }`}>
                                {option}
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StylePreferencesStep; 