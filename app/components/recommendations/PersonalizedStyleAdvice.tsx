"use client"
import Image from "next/image";
import { StyleQuizData, UserTagsData, ColorAnalysis } from "@/lib/hooks/useStyleQuizData";

interface ColorInfo {
  name: string;
  hex: string;
}

interface StylistProps {
  quizData: (StyleQuizData & { usertags: UserTagsData[] }) | null;
  colorAnalysis: ColorAnalysis | null;
}

const Stylist: React.FC<StylistProps> = ({ quizData, colorAnalysis }) => {

  // Function to get unique colors from recommended_colours
  const getUniqueColors = (): ColorInfo[] => {
    if (!colorAnalysis?.recommended_colours) return [];

    // Create a Set to store unique color combinations
    const uniqueColors = new Set<string>();
    const result: ColorInfo[] = [];

    // Helper function to add colors from a category
    const addCategoryColors = (category: [string, string][]) => {
      category.forEach(([name, hex]) => {
        const key = `${name}-${hex}`;
        if (!uniqueColors.has(key)) {
          uniqueColors.add(key);
          result.push({ name, hex });
        }
      });
    };

    // Add colors from each category
    Object.values(colorAnalysis.recommended_colours).forEach(category => {
      addCategoryColors(category);
    });

    // Return first 5 unique colors
    return result.slice(0, 5);
  };

  const colors = colorAnalysis ? getUniqueColors() : [
    { hex: '#D8CAB8', name: 'Warm Beige' },
    { hex: '#A3A380', name: 'Muted Olive' },
    { hex: '#E5B299', name: 'Pale Terracotta' },
    { hex: '#BFBFBF', name: 'Stone Grey' },
    { hex: '#FDF6EC', name: 'Cream White' }
  ];

  // Component now receives data as props, so no need for loading/error states
  
  return (
    <div className="px-4 mb-8 w-full max-w-[480px] mx-auto md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px]">
      {/*stylist section*/}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="p-0">
          {/* Text + Image */}
          <div className="flex flex-col items-center justify-between md:max-w-[80%] lg:max-w-[70%] mx-auto">
            <p className="font-[Boston] text-[10px] md:text-[14px] lg:text-[16px] not-italic font-normal leading-normal text-center">
              <span className="font-semibold">{quizData?.name || 'Ahan'}</span>, your style journey
              starts with your
              <span className="font-semibold"> quiz</span> answers, layered
              <br className="hidden md:block"/> with <span className="font-semibold">AI </span>
              insights and<span className="font-semibold"> stylist </span>
              expertise — all working together to{" "}
              <span className="flex items-center justify-center">
                tailor every look just for you.
              </span>
            </p>

            <div className="flex flex-row items-center overflow-x-auto mt-6 px-4 gap-0 md:gap-4 lg:gap-8 md:justify-center md:overflow-visible">
              <div className="flex flex-col items-center w-[90px] md:w-[120px] lg:w-[150px]">
                <Image
                  src="/assets/quiz.svg"
                  alt="quiz photo"
                  width={80}
                  height={70}
                  className="object-contain shrink-0 md:w-[100px] md:h-[90px] lg:w-[120px] lg:h-[110px]"
                />
                <span className="font-light text-black text-[10px] md:text-[12px] lg:text-[14px] text-center">
                  QUIZ
                </span>
              </div>

              <p className="text-xs font-light md:text-base lg:text-lg">+</p>

              <div className="flex flex-col items-center w-[90px] md:w-[120px] lg:w-[150px]">
                <Image
                  src="/assets/ai.svg"
                  alt="ai photo"
                  width={80}
                  height={70}
                  className="object-contain shrink-0 md:w-[100px] md:h-[90px] lg:w-[120px] lg:h-[110px]"
                />
                <span className="font-light text-black text-[10px] md:text-[12px] lg:text-[14px] text-center">
                  AI
                </span>
              </div>

              <p className="text-xs font-light md:text-base lg:text-lg">+</p>

              <div className="flex flex-col items-center w-[90px] md:w-[120px] lg:w-[150px]">
                <Image
                  src="/assets/stylist.svg"
                  alt="stylist photo"
                  width={80}
                  height={70}
                  className="object-contain shrink-0 md:w-[100px] md:h-[90px] lg:w-[120px] lg:h-[110px]"
                />
                <span className="font-light text-black text-[10px] md:text-[12px] lg:text-[14px] text-center">
                  STYLIST
                </span>
              </div>
            </div>
          </div>

          {/* White horizontal line */}
          <hr className="w-full border-t border-gray-400 mt-4 md:mt-6 lg:mt-8" />

          {/* Heading and Paragraph */}
          <div className="flex flex-row justify-between items-start mt-4 gap-12 md:gap-4 md:mt-6 lg:mt-8 md:max-w-[90%] lg:max-w-[80%] mx-auto">
            {/* Left Section: Heading + Paragraph */}
            <div className="w-2/3 md:w-3/5">
              <h1 className="text-[11px] md:text-[13px] lg:text-[15px] tracking-normal font-semibold mt-2">
                YOUR COLOR ANALYSIS
              </h1>
              <p className="mt-2 font-[Boston] text-[12px] md:text-[14px] lg:text-[16px] not-italic font-light leading-normal">
                {colorAnalysis ? 
                  `With your ${colorAnalysis?.undertone} undertones, these harmonious colors will enhance your natural style and create a balanced, sophisticated look.` :
                  'With your soft undertones and calm personality, light earthy tones and minimal pieces enhance your natural ease and elegance.'
                }
              </p>
            </div>

            {/* Right Section: Color Boxes in Column */}
            <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 w-1/2 md:w-2/5 items-end">
              {colors.map((color, index) => (
                <div key={index} className="relative">
                  <div
                    className="w-[140px] md:w-[200px] lg:w-[250px] h-[23px] md:h-[40px] lg:h-[50px]"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[9px] md:text-[12px] lg:text-[14px] font-[Boston p-2] ${
                    color.hex.toLowerCase() === '#ffffff' || 
                    color.hex.toLowerCase() === '#fdf6ec' || 
                    color.hex.toLowerCase() === '#ffe5b4' || 
                    color.hex.toLowerCase() === '#f5f5dc'
                      ? 'text-[#8B7355]' 
                      : 'text-[#F5F1EA]'
                  }`}>
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Stylist;
