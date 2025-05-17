import React from 'react';
import { formatPhoneNumber } from '@/app/utils/styleQuizUtils';

interface OtpVerificationStepProps {
    formValues: {
        phone?: string;
        otp?: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    otpSent: boolean;
}

const OtpVerificationStep: React.FC<OtpVerificationStepProps> = ({
    formValues,
    handleChange,
    otpSent
}) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1">
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
                        placeholder="+91 9876543210"
                        pattern="^(\+91[\s-]?)?[0]?[789]\d{9}$"
                        title="Please enter a valid Indian phone number"
                    />
                </div>
            </div>

            {otpSent && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="otp"
                            value={formValues.otp || ''}
                            onChange={handleChange}
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-[#007e90] p-2"
                            placeholder="Enter 6-digit OTP"
                            pattern="\d{6}"
                            maxLength={6}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default OtpVerificationStep; 