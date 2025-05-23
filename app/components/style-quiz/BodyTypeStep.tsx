import React from 'react';
import { BODY_TYPE_IMAGES } from '@/app/utils/styleQuizUtils';

type BodyTypeKey = keyof typeof BODY_TYPE_IMAGES;

interface BodyTypeStepProps {
    formValues: {
        bodyType?: string;
        gender?: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BodyTypeStep: React.FC<BodyTypeStepProps> = ({ formValues, handleChange }) => {
    return (
        <div className="space-y-6">
            <label className="block text-[25px] text-gray-700 mb-6">How would you describe your body type?</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-6">
                {Object.entries(BODY_TYPE_IMAGES).map(([type]) => (
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
                                src={BODY_TYPE_IMAGES[type as BodyTypeKey][formValues.gender?.toLowerCase() === 'male' ? 'male' : 'female']}
                                alt={`${type} body type`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="mt-2 text-[12px] md:text-[14px] font-medium text-gray-700 capitalize">{type}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default BodyTypeStep; 