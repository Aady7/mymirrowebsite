import React from 'react';

interface GoToStyleStepProps {
    formValues: {
        goToStyle?: string[];
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GoToStyleStep: React.FC<GoToStyleStepProps> = ({ formValues, handleChange }) => {
    return (
        <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-4">Select your go-to styles</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['streetwear', 'business casual', 'athleisure'].map(style => (
                    <label key={style} className="flex items-center justify-center">
                        <input
                            type="checkbox"
                            name="goToStyle"
                            value={style}
                            checked={formValues.goToStyle?.includes(style)}
                            onChange={handleChange}
                            className="hidden"
                        />
                        <div className={`w-full py-4 px-6 rounded-lg text-center cursor-pointer transition-all text-xs md:text-sm ${formValues.goToStyle?.includes(style) ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
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