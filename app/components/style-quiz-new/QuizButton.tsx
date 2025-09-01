import React from 'react';

interface QuizButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const QuizButton: React.FC<QuizButtonProps> = ({
  children,
  onClick,
  variant = 'outline',
  size = 'md',
  disabled = false,
  selected = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = "font-[400] text-[14px] leading-[100%] tracking-[-0.02em] rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-black text-white hover:bg-gray-800 focus:ring-black",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300",
    outline: selected 
      ? "bg-black text-white border-2 border-black" 
      : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 focus:ring-gray-300"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4"
  };
  
  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed" 
    : "cursor-pointer";

  const combinedClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${disabledClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default QuizButton;
