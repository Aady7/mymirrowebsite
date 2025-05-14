import React from 'react';
import { formatPhoneNumber } from '@/app/utils/styleQuizUtils';

interface PersonalInfoStepProps {
    formValues: {
        name?: string;
        phone?: string;
        gender?: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ formValues, handleChange }) => {
    return (
        <div className="flex flex-col space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    name="name"
                    value={formValues.name || ''}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-[#007e90] p-2"
                    placeholder="Enter your name"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                    type="tel"
                    name="phone"
                    value={formValues.phone || ''}
                    onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        handleChange({
                            target: { name: 'phone', value: formatted }
                        } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-[#007e90] p-2"
                    placeholder="Enter your phone number"
                />
            </div>
            <div className="flex space-x-4">
                {['male', 'female', 'other'].map(g => (
                    <label key={g} className="flex-1 flex items-center justify-center">
                        <input type="radio" name="gender" value={g} checked={formValues.gender === g} onChange={handleChange} className="hidden" />
                        <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer ${formValues.gender === g ? 'bg-[#007e90] text-white' : 'bg-white text-[#007e90] border-2 border-[#007e90]'
                            }`}>
                            <span className="text-sm font-medium">{g.charAt(0).toUpperCase() + g.slice(1)}</span>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default PersonalInfoStep; 