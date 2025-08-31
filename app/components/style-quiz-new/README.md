# Style Quiz Components

This folder contains reusable components for the style quiz feature.

## Components

### 1. ProgressBar
A reusable progress bar component that shows current step progress.

**Props:**
- `currentStep` (number): The current step number
- `totalSteps` (number): Total number of steps
- `className` (string, optional): Additional CSS classes

**Usage:**
```tsx
<ProgressBar currentStep={1} totalSteps={8} />
```

### 2. QuizButton
A reusable button component with multiple variants and selection states.

**Props:**
- `children` (ReactNode): Button content
- `onClick` (function, optional): Click handler
- `variant` ('primary' | 'secondary' | 'outline'): Button style variant
- `size` ('sm' | 'md' | 'lg'): Button size
- `disabled` (boolean): Whether button is disabled
- `selected` (boolean): Whether button is selected (for outline variant)
- `className` (string, optional): Additional CSS classes
- `type` ('button' | 'submit' | 'reset'): Button type

**Usage:**
```tsx
<QuizButton 
  variant="primary" 
  size="lg" 
  onClick={handleClick}
>
  Continue
</QuizButton>

<QuizButton 
  selected={isSelected} 
  onClick={handleSelect}
>
  Option
</QuizButton>
```

### 3. PersonalInfo
The personal information step of the style quiz.

**Props:**
- `onNext` (function, optional): Callback when continuing to next step
- `onBack` (function, optional): Callback when going back
- `initialData` (Partial<PersonalInfoData>, optional): Pre-filled form data
- `currentStep` (number, optional): Current step number (default: 1)
- `totalSteps` (number, optional): Total steps (default: 8)

**Data Interface:**
```tsx
interface PersonalInfoData {
  name: string;
  gender: 'Female' | 'Male' | 'Other' | '';
  age: '<18' | '18-25' | '26-35' | '36-45' | '';
  occupation: 'Student' | 'Working Professional' | 'Creative' | 'Enterpreneur' | 'Athlete' | 'Other' | '';
}
```

**Usage:**
```tsx
const handleNext = (data: PersonalInfoData) => {
  console.log('Personal info:', data);
  // Navigate to next step
};

<PersonalInfo
  onNext={handleNext}
  currentStep={1}
  totalSteps={8}
/>
```

### 4. ColorAnalysis
The skin tone color analysis step of the style quiz.

**Props:**
- `onNext` (function, optional): Callback when continuing to next step
- `onBack` (function, optional): Callback when going back
- `initialData` (Partial<ColorAnalysisData>, optional): Pre-filled form data
- `currentStep` (number, optional): Current step number (default: 3)
- `totalSteps` (number, optional): Total steps (default: 8)

**Data Interface:**
```tsx
interface ColorAnalysisData {
  selectedTone: string;
  toneName: string;
}
```

**Usage:**
```tsx
const handleNext = (data: ColorAnalysisData) => {
  console.log('Color analysis:', data);
  // Navigate to next step
};

<ColorAnalysis
  onNext={handleNext}
  currentStep={3}
  totalSteps={8}
/>
```

### 5. StyleOrigin
The style origin/preference step of the style quiz.

**Props:**
- `onNext` (function, optional): Callback when continuing to next step
- `onBack` (function, optional): Callback when going back
- `initialData` (Partial<StyleOriginData>, optional): Pre-filled form data
- `currentStep` (number, optional): Current step number (default: 4)
- `totalSteps` (number, optional): Total steps (default: 8)
- `gender` ('Female' | 'Male' | 'Other' | '', optional): User's gender to show appropriate images

**Data Interface:**
```tsx
interface StyleOriginData {
  styleOrigin: string;
}
```

**Usage:**
```tsx
const handleNext = (data: StyleOriginData) => {
  console.log('Style origin:', data);
  // Navigate to next step
};

<StyleOrigin
  onNext={handleNext}
  currentStep={4}
  totalSteps={8}
  gender="Female"
/>
```

### 6. StyleVibe
The style vibe selection step with 5 options in a 3+2 layout.

**Props:**
- `onNext` (function, optional): Callback when continuing to next step
- `onBack` (function, optional): Callback when going back
- `initialData` (Partial<StyleVibeData>, optional): Pre-filled form data
- `currentStep` (number, optional): Current step number (default: 5)
- `totalSteps` (number, optional): Total steps (default: 8)
- `gender` ('Female' | 'Male' | 'Other' | '', optional): User's gender to show appropriate images

**Data Interface:**
```tsx
interface StyleVibeData {
  styleVibe: string;
}
```

**Layout:**
- Top row: 3 items in a grid
- Bottom row: 2 items centered

**Usage:**
```tsx
const handleNext = (data: StyleVibeData) => {
  console.log('Style vibe:', data);
  // Navigate to next step
};

<StyleVibe
  onNext={handleNext}
  currentStep={5}
  totalSteps={8}
  gender="Female"
/>
```

### 7. ContactVerification
The contact verification step with email and phone OTP functionality.

**Props:**
- `onNext` (function, optional): Callback when continuing to next step
- `onBack` (function, optional): Callback when going back
- `initialData` (Partial<ContactVerificationData>, optional): Pre-filled form data
- `currentStep` (number, optional): Current step number (default: 6)
- `totalSteps` (number, optional): Total steps (default: 7)

**Data Interface:**
```tsx
interface ContactVerificationData {
  email: string;
  phone: string;
  isVerified: boolean;
}
```

**Features:**
- Email validation with real-time feedback
- Phone number validation (Indian format)
- Automatic OTP sending to both email and phone
- Integration with Supabase authentication
- Loading states and error handling

**Usage:**
```tsx
const handleNext = (data: ContactVerificationData) => {
  console.log('Contact verification:', data);
  // Navigate to next step
};

<ContactVerification
  onNext={handleNext}
  currentStep={6}
  totalSteps={7}
/>
```

### 8. OtpVerification
The final OTP verification step with 4-digit input and quiz completion.

**Props:**
- `onNext` (function, optional): Callback when verification is complete
- `onBack` (function, optional): Callback when going back
- `initialData` (Partial<OtpVerificationData>, optional): Pre-filled form data
- `currentStep` (number, optional): Current step number (default: 7)
- `totalSteps` (number, optional): Total steps (default: 7)
- `email` (string, optional): Email for verification
- `phone` (string, optional): Phone for verification
- `allQuizData` (any, optional): Complete quiz data for logging

**Data Interface:**
```tsx
interface OtpVerificationData {
  isVerified: boolean;
  verifiedEmail: string;
  verifiedPhone: string;
}
```

**Features:**
- 6-digit OTP input with auto-focus
- Countdown timer with resend functionality (60 seconds)
- Paste support for OTP codes
- Dual verification (email + phone)
- Complete quiz data logging
- Automatic redirect to recommendations page
- Loading states and error handling

**Usage:**
```tsx
const handleNext = (data: OtpVerificationData) => {
  console.log('OTP verification complete:', data);
  // Quiz completed, redirect handled automatically
};

<OtpVerification
  onNext={handleNext}
  currentStep={7}
  totalSteps={7}
  email="user@example.com"
  phone="9876543210"
  allQuizData={completeQuizState}
/>
```

## Features

- **Form Validation**: Real-time validation with error messages
- **Responsive Design**: Mobile-first design approach
- **Accessibility**: Proper focus management and ARIA labels
- **TypeScript**: Full type safety
- **Reusable**: Modular components that can be used across the quiz
