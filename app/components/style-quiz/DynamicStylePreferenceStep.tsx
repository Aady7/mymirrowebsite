import React from 'react';
import { STYLE_PREFERENCE_IMAGES } from '@/app/utils/styleQuizUtils';

type StyleKey = keyof typeof STYLE_PREFERENCE_IMAGES;
type GenderKey = 'male' | 'female';

interface DynamicStylePreferenceStepProps {
    style: string;
    formValues: {
        gender?: string;
        [key: string]: any;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DynamicStylePreferenceStep: React.FC<DynamicStylePreferenceStepProps> = ({ style, formValues, handleChange }) => {
    // Normalize the style name to remove spaces for the form key
    const normalizedStyle = style.replace(/\s+/g, '_');
    const key = `preferred_${normalizedStyle}`;
    const gender = formValues.gender?.toLowerCase() === 'male' ? 'male' : 'female';
    const images = STYLE_PREFERENCE_IMAGES[style as StyleKey][gender];
    const options = Object.entries(images);

    // Debug logging to help identify the issue
    console.log('DynamicStylePreferenceStep:', {
        style,
        normalizedStyle,
        key,
        currentFormValue: formValues[key]
    });

    return (
        <div>
            <label className="block text-[25px] text-gray-700 mb-4">Select your preferred {style} items</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {options.map(([itemName, imagePath]) => (
                    <label key={itemName} className="flex flex-col items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name={key}
                            value={itemName}
                            checked={formValues[key]?.includes(itemName) || false}
                            onChange={handleChange}
                            className="hidden"
                        />
                        <div className={`w-full aspect-[3/4] border-2 rounded-lg overflow-hidden transition-all ${
                            (formValues[key]?.includes(itemName) || false) ? 'border-[#007e90] shadow-lg' : 'border-gray-200'
                        }`}>
                            <img
                                src={imagePath}
                                alt={`${style} ${itemName}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className={`mt-2 py-2 px-4 rounded-lg text-center transition-all text-[14px] ${
                            (formValues[key]?.includes(itemName) || false) ? 'bg-[#007e90] text-white' : 'bg-white text-gray-700'
                        }`}>
                            {itemName}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default DynamicStylePreferenceStep; 