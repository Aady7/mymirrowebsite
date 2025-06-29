"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { StyleQuizData, UserTagsData } from "@/lib/hooks/useStyleQuizData";
import tarrotMapping from "@/app/data/tarrotcartmapping.json";
import maleTarrotMapping from "@/app/data/maletarrotcardmapping.json";

interface FashionTarotProps {
  quizData: (StyleQuizData & { usertags: UserTagsData[] }) | null;
}

const FashionTarot: React.FC<FashionTarotProps> = ({ quizData }) => {
  const [selectedCards, setSelectedCards] = useState<Array<{ tag: string; image: string; title: string; elaborate: string }>>([]);
  const [flippedStates, setFlippedStates] = useState<boolean[]>([]);
  const hasProcessedRef = useRef<string | null>(null);

  useEffect(() => {
    // Create a unique key for this data to prevent duplicate processing
    const dataKey = quizData?.name || 'no-data';
    
    // If we've already processed this exact data, skip
    if (hasProcessedRef.current === dataKey) {
      return;
    }
    
    console.log('Processing tarot data for:', dataKey);
    hasProcessedRef.current = dataKey;
    
    // Check for usertags in the processed data first
    let userTags = quizData?.usertags;
    
    // If usertags is not available, try to parse from user_tags directly
    if (!userTags && quizData?.user_tags) {
      try {
        if (typeof quizData.user_tags === 'string') {
          userTags = JSON.parse(quizData.user_tags);
          console.log('Parsed user_tags from string:', userTags);
        } else {
          userTags = quizData.user_tags;
          console.log('Using user_tags directly:', userTags);
        }
      } catch (e) {
        console.error('Error parsing user_tags:', e);
        return;
      }
    }
    
    if (!userTags) {
      console.error('No user_tags found in quiz data');
      console.log('Available keys in quizData:', Object.keys(quizData || {}));
      return;
    }

    console.log('User tags:', userTags);

    if (!Array.isArray(userTags) || userTags.length === 0) {
      console.error('Usertags is not an array or is empty');
      return;
    }

    const personalityTags = userTags[0].personality_tags;
    const userGender = quizData?.gender?.toLowerCase() || 'female';
    console.log('Personality tags:', personalityTags);
    console.log('User gender:', userGender);

    if (!Array.isArray(personalityTags) || personalityTags.length === 0) {
      console.error('No personality tags found');
      return;
    }

    // Choose mapping based on gender
    const mappingToUse = userGender === 'male' ? maleTarrotMapping : tarrotMapping;
    console.log('Using tarot mapping for:', userGender);
    
    const matchingCards = personalityTags
      .map(tag => {
        const found = mappingToUse.find(card => card.tag.toLowerCase() === tag.toLowerCase());
        console.log(`Looking for tag ${tag}, found:`, found);
        return found;
      })
      .filter((card): card is typeof mappingToUse[0] => card !== undefined)
      .slice(0, 2);

    console.log('Final matching cards:', matchingCards);

    if (matchingCards.length > 0) {
      setSelectedCards(matchingCards);
      setFlippedStates(new Array(matchingCards.length).fill(false));
    }
  }, [quizData]);

  const handleCardFlip = (index: number) => {
    setFlippedStates(prev => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  // Component now receives data as props, so no need for loading/error states

  if (!selectedCards.length) {
    return (
      <div className="text-center mt-8">
        <p>No matching tarot cards found for your personality.</p>
        <p className="text-sm text-gray-600 mt-2">Please complete the style quiz to see your cards.</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mt-8 p-3 md:mt-12 lg:mt-16 md:max-w-[80%] lg:max-w-[70%] mx-auto">
        <h1 className="font-['Boston'] text-xl md:text-2xl lg:text-3xl flex items-center justify-center">
          FASHION TAROT CARD 
        </h1>           

        <p className="pt-2 flex items-center text-center font-[Boston] text-[14px] md:text-[16px] lg:text-[18px] not-italic font-normal leading-normal justify-center">
        Flip the card to reveal your style spirit, a<br/>fashion truth shaped by your personality.
        </p>                                                  
      </div>

      {/* Tarot Cards */}
      <div className="mt-6 px-8 md:mt-10 lg:mt-12 md:px-0">
        <div className="flex flex-row gap-10 md:gap-16 lg:gap-20 justify-center">
          {selectedCards.map((card, index) => (
            <div

              key={card.tag}
              className="w-[152px] h-[240px] md:w-[200px] md:h-[320px] lg:w-[250px] lg:h-[400px] perspective cursor-pointer"
              onClick={() => handleCardFlip(index)}

            >
              <div
                className={`relative w-full h-full duration-800 transform-style preserve-3d ${
                  flippedStates[index] ? "rotate-y-180" : ""
                }`}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden ">
                  <Image
                    src={card.image}
                    alt={`Tarot Card for ${card.tag}`}
                    fill
                    className="object-cover rounded-xl  "
                  />
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="relative w-full h-full">
                    <Image
                      src="/assets/tarrotback.svg"
                      alt="Tarot Card Back"
                      fill
                      className="object-cover rounded-xl "
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pl-8 pr-8 text-center">
                      <h3 className="font-['Lora'] text-[14px] md:text-[20px] lg:text-[24px] text-[#D4AF7F] mb-2">
                        {card.title}
                      </h3>
                      <p className="font-['Boston'] italic text-[9px] md:text-[11px] lg:text-[14px] text-[#F3E9DC] leading-tight md:px-6 px-2 pb-2 overflow-hidden max-h-[120px]  md:max-h-[140px] lg:max-h-[180px]" >
                        {card.elaborate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FashionTarot;
