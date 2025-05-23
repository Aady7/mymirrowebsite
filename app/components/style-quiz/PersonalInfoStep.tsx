import React from 'react';

interface PersonalInfoStepProps {
    formValues: {
        name?: string;
        gender?: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ formValues, handleChange }) => {
    return (
        <div className="flex flex-col space-y-8">
            <div>
                <label className="block text-[25px] text-gray-700 mb-2">What can we call you?</label>
                <input
                    name="name"
                    value={formValues.name || ''}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-[#007e90] p-2 text-[14px]"
                    placeholder="Enter your name"
                />
            </div>

            <div>
                <label className="block text-[25px] text-gray-700 mb-4">Your Gender</label>
                <div className="flex space-x-4">
                    {['male', 'female', 'other'].map(g => (
                        <label key={g} className="flex-1 flex items-center justify-center">
                            <input type="radio" name="gender" value={g} checked={formValues.gender === g} onChange={handleChange} className="hidden" />
                            <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer ${formValues.gender === g ? 'bg-[#007e90] text-white' : 'bg-white text-[#007e90] border-2 border-[#007e90]'
                                }`}>
                                <span className="text-[14px] font-medium">{g.charAt(0).toUpperCase() + g.slice(1)}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoStep; 