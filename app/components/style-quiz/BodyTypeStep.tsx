import React from 'react';
import { BODY_TYPE_IMAGES } from '@/app/utils/styleQuizUtils';

interface BodyTypeStepProps {
    formValues: {
        bodyType?: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BodyTypeStep: React.FC<BodyTypeStepProps> = ({ formValues, handleChange }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(BODY_TYPE_IMAGES).map(([type, image]) => (
                <label key={type} className="flex flex-col items-center cursor-pointer">
                    <input
                        type="radio"
                        name="bodyType"
                        value={type}
                        checked={formValues.bodyType === type}
                        onChange={handleChange}
                        className="hidden"
                    />
                    <div className={`w-full aspect-[3/4] border-2 rounded-lg overflow-hidden transition-all ${formValues.bodyType === type ? 'border-[#007e90] shadow-lg' : 'border-gray-200'
                        }`}>
                        <img
                            src={image}
                            alt={`${type} body type`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="mt-2 text-xs md:text-sm font-medium text-gray-700 capitalize">{type}</span>
                </label>
            ))}
        </div>
    );
};

export default BodyTypeStep; 