"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useStyleQuizData } from "@/lib/hooks/useStyleQuizData";
import tarrotMapping from "@/app/data/tarrotcartmapping.json";

const FashionTarot = () => {
  const [selectedCards, setSelectedCards] = useState<Array<{ tag: string; image: string }>>([]);
  const [flippedStates, setFlippedStates] = useState<boolean[]>([]);
  const { quizData, isLoading, error } = useStyleQuizData();

  useEffect(() => {
    console.log('Full quiz data:', quizData);
    
    if (!quizData?.usertags) {
      console.error('No usertags found in quiz data');
      return;
    }

    const userTags = quizData.usertags;
    console.log('User tags:', userTags);

    if (!Array.isArray(userTags) || userTags.length === 0) {
      console.error('Usertags is not an array or is empty');
      return;
    }

    const personalityTags = userTags[0].personality_tags;
    console.log('Personality tags:', personalityTags);

    if (!Array.isArray(personalityTags) || personalityTags.length === 0) {
      console.error('No personality tags found');
      return;
    }

    console.log('Tarrot mapping:', tarrotMapping);
    
    const matchingCards = personalityTags
      .map(tag => {
        const found = tarrotMapping.find(card => card.tag.toLowerCase() === tag.toLowerCase());
        console.log(`Looking for tag ${tag}, found:`, found);
        return found;
      })
      .filter((card): card is typeof tarrotMapping[0] => card !== undefined)
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

  if (isLoading) {
    return <div className="text-center mt-8">Loading your tarot cards...</div>;
  }

  if (error) {
    return <div className="text-center mt-8">Error loading your tarot cards: {error}</div>;
  }

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
          Uncover your style spirit — each card reveals a <br className="md:hidden" />
          fashion truth based on your personality.
        </p>                                                  
      </div>

      {/* Tarot Cards */}
      <div className="mt-6 px-10 md:mt-10 lg:mt-12 md:px-0">
        <div className="flex flex-row gap-10 md:gap-16 lg:gap-20 justify-center">
          {selectedCards.map((card, index) => (
            <div
              key={card.tag}
              className="w-[152px] h-[240px] md:w-[200px] md:h-[320px] lg:w-[250px] lg:h-[400px] perspective cursor-pointer"
              onClick={() => handleCardFlip(index)}
            >
              <div
                className={`relative w-full h-full duration-700 transform-style preserve-3d ${
                  flippedStates[index] ? "rotate-y-180" : ""
                }`}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden">
                  <Image
                    src={card.image}
                    alt={`Tarot Card for ${card.tag}`}
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="w-full h-full bg-black/80 rounded-2xl p-4 text-white flex items-center justify-center">
                    <p className="text-center font-['Boston'] text-lg">
                      {card.tag.toUpperCase()} Style Personality
                    </p>
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
