"use client"
import Image from "next/image";
import { motion } from "framer-motion";
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
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/30"></div>
      
      {/*stylist section*/}
      <motion.div 
        className="relative z-10 p-10 md:p-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gray-900/5 border border-gray-200 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium text-gray-700 tracking-wide">AI-POWERED INSIGHTS</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Your Style Journey
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
            Personalized recommendations crafted through the perfect blend of your preferences, AI intelligence, and expert styling
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Content Card */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-4 sm:p-6 md:p-10 lg:p-14 shadow-xl shadow-gray-900/5">
            {/* Personalized Message */}
            <motion.div 
              className="text-center mb-8 sm:mb-12 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {/* Mobile: No inner card, Desktop: Keep inner card */}
              <div className="block sm:hidden">
                <p className="text-lg text-gray-700 leading-relaxed font-light">
                  <span className="font-medium text-gray-900">{quizData?.name || 'Ahan'}</span>, your style journey
                  starts with your <span className="font-medium text-gray-900">quiz</span> answers, layered
                  with <span className="font-medium text-gray-900">AI insights</span> and 
                  <span className="font-medium text-gray-900"> stylist expertise</span>, 
                  all working together to tailor every look just for you.
                </p>
              </div>
              
              <div className="hidden sm:block bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 md:p-8 border border-gray-200/60">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                  <span className="font-medium text-gray-900">{quizData?.name || 'Ahan'}</span>, your style journey
                  starts with your <span className="font-medium text-gray-900">quiz</span> answers, layered
                  with <span className="font-medium text-gray-900">AI insights</span> and 
                  <span className="font-medium text-gray-900"> stylist expertise</span>, 
                  all working together to tailor every look just for you.
                </p>
              </div>
            </motion.div>

            {/* Process Flow - Hidden on mobile for cleaner layout */}
            <motion.div 
              className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {/* Quiz Card */}
              <motion.div 
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 text-center border border-gray-200/60 shadow-lg shadow-gray-900/5"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg border border-gray-200/60">
                  <Image
                    src="/assets/quiz.svg"
                    alt="quiz photo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3 tracking-wide">QUIZ</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Your personal style preferences and lifestyle choices</p>
              </motion.div>

              {/* AI Card */}
              <motion.div 
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 text-center border border-gray-200/60 shadow-lg shadow-gray-900/5"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg border border-gray-200/60">
                  <Image
                    src="/assets/ai.svg"
                    alt="ai photo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3 tracking-wide">AI</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Advanced algorithms analyze trends and perfect matches</p>
              </motion.div>

              {/* Stylist Card */}
              <motion.div 
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 text-center border border-gray-200/60 shadow-lg shadow-gray-900/5"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg border border-gray-200/60">
                  <Image
                    src="/assets/stylist.svg"
                    alt="stylist photo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3 tracking-wide">STYLIST</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Professional expertise and fashion industry insights</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Color Analysis Section */}
          <motion.div 
            className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/60 rounded-2xl p-4 sm:p-6 md:p-10 mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <div className="text-center mb-8 sm:mb-12">
              <motion.div
                className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gray-900/5 border border-gray-200 rounded-full mb-4 sm:mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-xs sm:text-sm font-medium text-gray-700 tracking-wide">COLOR ANALYSIS</span>
              </motion.div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 sm:mb-6 tracking-tight">
                YOUR PERFECT PALETTE
              </h3>
              <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed font-light px-2 sm:px-0">
                {colorAnalysis ? 
                  `With your ${colorAnalysis?.undertone} undertones, these harmonious colors will enhance your natural style and create a balanced, sophisticated look.` :
                  'With your soft undertones and calm personality, light earthy tones and minimal pieces enhance your natural ease and elegance.'
                }
              </p>
            </div>

            {/* Color Palette Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {colors.map((color, index) => (
                <motion.div 
                  key={index} 
                  className="group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-200/60 shadow-lg shadow-gray-900/5 group-hover:shadow-xl transition-all duration-300">
                    <div
                      className="w-full h-16 sm:h-20 md:h-24 rounded-lg sm:rounded-xl mb-3 sm:mb-4 border border-gray-200/60"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-900 text-center mb-1">
                      {color.name}
                    </h4>
                    <p className="text-xs text-gray-500 text-center font-mono">
                      {color.hex.toUpperCase()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default Stylist;
