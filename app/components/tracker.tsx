 "use client";

type Props = {
  currentStep: number; // 1 to 3
};

const CheckoutTracker = ({ currentStep }: Props) => {
  const fillPercent = (currentStep - 1) * 50; // 0%, 50%, 100%

  return (
    <div className="w-full flex flex-col items-center px-4 mt-6">
      <div className="relative w-full max-w-xl flex items-center justify-between">
        {/* Step Circles */}
        {["Address", "Payment", "Confirmation"].map((label, idx) => {
          const step = idx + 1;
          return (
            <div key={label} className="flex flex-col items-center z-10 w-1/3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= step
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {step}
              </div>
              <span className="mt-1 text-xs sm:text-sm font-medium text-center">
                {label}
              </span>
            </div>
          );
        })}

        {/* Track Line Background */}
        <div className="absolute top-1/2 left-5 right-5 h-1 bg-gray-300 -z-10 transform -translate-y-1/2 rounded-full" />

        {/* Green Fill Line */}
        <div
          className="absolute top-1/2 left-5 h-1 bg-green-500 -z-10 rounded-full transition-all duration-500"
          style={{ width: `${fillPercent}%`, transform: "translateY(-50%)`" }}
        />
      </div>
    </div>
  );
};

export default CheckoutTracker;
