'use client'

import React, { useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import Image from 'next/image'
import ProgressBar from './ProgressBar'

export interface OutfitData {
  id: string
  name: string
  image: string
  category: string
}

export interface SwipeResultData {
  likedOutfits: OutfitData[]
  dislikedOutfits: OutfitData[]
  superLikedOutfits: OutfitData[]
}

interface OutfitSwipeProps {
  onNext: (data: SwipeResultData) => void
  onBack: () => void
  currentStep: number
  totalSteps: number
  gender: string
}

const OutfitSwipe: React.FC<OutfitSwipeProps> = ({
  onNext,
  onBack,
  currentStep,
  totalSteps,
  gender
}) => {
  // Define outfits based on gender (using male style vibe images as example)
  const getOutfits = (): OutfitData[] => {
    const maleOutfits = [
      {
        id: 'streetwear',
        name: 'Streetwear chic',
        image: '/assets/newstylequizimages/maleStyleVibe/streetwearcasual.svg',
        category: 'Streetwear'
      },
      {
        id: 'minimal',
        name: 'Minimal & clean',
        image: '/assets/newstylequizimages/maleStyleVibe/minimal&clean.svg',
        category: 'Minimal'
      },
      {
        id: 'oldmoney',
        name: 'Old money',
        image: '/assets/newstylequizimages/maleStyleVibe/oldmoney.svg',
        category: 'Classic'
      },
      {
        id: 'sporty',
        name: 'Sporty athleisure',
        image: '/assets/newstylequizimages/maleStyleVibe/sportyathleisure.svg',
        category: 'Athletic'
      },
      {
        id: 'bold',
        name: 'Bold & statement',
        image: '/assets/newstylequizimages/maleStyleVibe/bold&statement.svg',
        category: 'Bold'
      }
    ]

    // For now, return male outfits. You can add female outfits later
    return maleOutfits
  }

  const outfits = getOutfits()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedOutfits, setLikedOutfits] = useState<OutfitData[]>([])
  const [dislikedOutfits, setDislikedOutfits] = useState<OutfitData[]>([])
  const [superLikedOutfits, setSuperLikedOutfits] = useState<OutfitData[]>([])
  const [swipingDirection, setSwipingDirection] = useState<'left' | 'right' | 'up' | null>(null)
  const [isCardExiting, setIsCardExiting] = useState(false)

  const currentOutfit = outfits[currentIndex]
  const isLastOutfit = currentIndex === outfits.length - 1

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (isCardExiting || !currentOutfit) return

    // Set the swiping direction and start exit animation
    setSwipingDirection(direction)
    setIsCardExiting(true)

    // Update the appropriate outfit array
    if (direction === 'right') {
      setLikedOutfits(prev => [...prev, currentOutfit])
    } else if (direction === 'left') {
      setDislikedOutfits(prev => [...prev, currentOutfit])
    } else if (direction === 'up') {
      setSuperLikedOutfits(prev => [...prev, currentOutfit])
    }

    // Wait for card to start exiting, then advance to next card
    setTimeout(() => {
      if (isLastOutfit) {
        // All outfits have been swiped, proceed to next step
        onNext({
          likedOutfits: direction === 'right' ? [...likedOutfits, currentOutfit] : likedOutfits,
          dislikedOutfits: direction === 'left' ? [...dislikedOutfits, currentOutfit] : dislikedOutfits,
          superLikedOutfits: direction === 'up' ? [...superLikedOutfits, currentOutfit] : superLikedOutfits
        })
      } else {
        // Move to next card and reset states
        setCurrentIndex(prev => prev + 1)
        setSwipingDirection(null)
        setIsCardExiting(false)
      }
    }, 300) // Reduced timeout for faster card transition
  }

  if (!currentOutfit) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="px-6 pt-12 pb-4">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>
        
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <h2 className="text-[26px] font-[700] leading-[100%] tracking-[-0.02em] text-black mb-4">
              Great choices! 
            </h2>
            <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-600 mb-6">
              You've reviewed all outfits. Let's continue with your style journey.
            </p>
                         <button
               onClick={() => onNext({ likedOutfits, dislikedOutfits, superLikedOutfits })}
               className="bg-black text-white px-8 py-4 rounded-lg text-[14px] font-[600] leading-[100%] tracking-[-0.02em]"
             >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="px-6 pt-12 pb-4">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[26px] font-[700] leading-[100%] tracking-[-0.02em] text-black mb-3">
            Swipe into Your Style
          </h1>
          <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-600 text-left">
            Like it, ditch it, or love it — Every swipe gets us closer to your fit.
          </p>
        </div>

                 {/* Swipe Cards Container */}
         <div className="relative h-[500px] mb-8 flex justify-center">
           <div className="relative w-full max-w-sm">
             {/* Render multiple cards for smooth stacking */}
             {outfits.slice(currentIndex, currentIndex + 3).map((outfit, index) => {
               const cardIndex = currentIndex + index
               const isCurrentCard = index === 0
               const isNextCard = index === 1
               const isThirdCard = index === 2
               
               return (
                 <SwipeCard
                   key={`${outfit.id}-${cardIndex}`}
                   outfit={outfit}
                   onSwipe={isCurrentCard ? handleSwipe : () => {}}
                   isCurrentCard={isCurrentCard}
                   isNextCard={isNextCard}
                   isThirdCard={isThirdCard}
                   swipingDirection={isCurrentCard ? swipingDirection : null}
                   isCardExiting={isCurrentCard ? isCardExiting : false}
                   zIndex={10 - index}
                 />
               )
             })}
             
             {/* Swipe Action Icon - Clickable for Super Swipe */}
             <button 
               onClick={() => handleSwipe('up')}
               className="absolute bottom-[-42.5px] left-1/2 transform -translate-x-1/2 w-[85px] h-[85px] bg-white rounded-[42.5px] shadow-lg flex items-center justify-center border-[1.7px] border-gray-200 z-50 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 active:scale-95" 
               style={{ paddingTop: '28.33px', paddingRight: '26.07px', paddingBottom: '28.33px', paddingLeft: '26.07px' }}
               disabled={isCardExiting}
             >
               <span className="text-2xl">🤌</span>
             </button>
           </div>
         </div>
      </div>

      {/* Bottom Indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  )
}

// Swipe Card Component
interface SwipeCardProps {
  outfit: OutfitData
  onSwipe: (direction: 'left' | 'right' | 'up') => void
  isCurrentCard: boolean
  isNextCard: boolean
  isThirdCard: boolean
  swipingDirection: 'left' | 'right' | 'up' | null
  isCardExiting: boolean
  zIndex: number
}

const SwipeCard: React.FC<SwipeCardProps> = ({ 
  outfit, 
  onSwipe, 
  isCurrentCard, 
  isNextCard, 
  isThirdCard, 
  swipingDirection, 
  isCardExiting, 
  zIndex 
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Enhanced rotation with reduced angle (15-20 degrees)
  const rotate = useTransform(x, [-200, 200], [-20, 20])
  const rotateY = useTransform(y, [-200, 0], [-15, 0])
  
  // Visual feedback colors for current card only - includes super swipe (up) feedback
  const backgroundColor = useTransform(
    [x, y],
    (values: number[]) => {
      const [latestX, latestY] = values
      
      // Super swipe (up) - light blue
      if (latestY < -50) {
        return 'rgba(59, 130, 246, 0.1)' // Light blue
      }
      // Left/right swipes
      else if (latestX < -50) {
        return 'rgba(239, 68, 68, 0.1)' // Red
      } else if (latestX > 50) {
        return 'rgba(34, 197, 94, 0.1)' // Green
      }
      return 'rgba(255, 255, 255, 1)' // White
    }
  )
  
  const borderColor = useTransform(
    [x, y],
    (values: number[]) => {
      const [latestX, latestY] = values
      
      // Super swipe (up) - light blue
      if (latestY < -50) {
        return 'rgba(59, 130, 246, 0.3)' // Light blue border
      }
      // Left/right swipes
      else if (latestX < -50) {
        return 'rgba(239, 68, 68, 0.3)' // Red border
      } else if (latestX > 50) {
        return 'rgba(34, 197, 94, 0.3)' // Green border
      }
      return 'rgba(229, 231, 235, 1)' // Gray border
    }
  )

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (!isCurrentCard) return
    
    const thresholdX = 80
    const thresholdY = -120
    
    if (info.offset.y < thresholdY) {
      onSwipe('up')
    } else if (info.offset.x > thresholdX) {
      onSwipe('right')
    } else if (info.offset.x < -thresholdX) {
      onSwipe('left')
    }
  }

  // Get the proper positioning and animation for each card
  const getCardAnimation = () => {
    if (isCurrentCard && isCardExiting && swipingDirection) {
      // Exit animation for current card being swiped
      switch (swipingDirection) {
        case 'left':
          return {
            x: -1000,
            y: 0,
            rotate: -30,
            opacity: 0
          }
        case 'right':
          return {
            x: 1000,
            y: 0,
            rotate: 30,
            opacity: 0
          }
        case 'up':
          return {
            x: 0,
            y: -1000,
            rotate: 0,
            rotateX: -15,
            opacity: 0
          }
      }
    }
    
    if (isCurrentCard) {
      // Current card - interactive
      return {
        scale: 1,
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1
      }
    } else if (isNextCard) {
      // Next card - slightly behind and smaller
      return {
        scale: 0.95,
        x: 0,
        y: 10,
        rotate: 0,
        opacity: 0.8
      }
    } else if (isThirdCard) {
      // Third card - furthest behind
      return {
        scale: 0.9,
        x: 0,
        y: 20,
        rotate: 0,
        opacity: 0.6
      }
    }
    
    return {}
  }

  // Get transition settings based on card state
  const getTransition = () => {
    if (isCurrentCard && isCardExiting) {
      return { duration: 0.4 }
    } else if (!isCurrentCard) {
      return { duration: 0.3 }
    }
    return { type: "spring" as const, stiffness: 400, damping: 40 }
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl shadow-lg overflow-hidden"
      style={{
        zIndex,
        ...(isCurrentCard && {
          x,
          y,
          rotate,
          rotateY,
          backgroundColor,
          borderWidth: '2px',
          borderColor,
          cursor: 'grab'
        }),
        ...(!isCurrentCard && {
          backgroundColor: 'white',
          borderWidth: '1px',
          borderColor: 'rgba(229, 231, 235, 1)'
        })
      }}
      drag={isCurrentCard ? true : false}
      dragConstraints={isCurrentCard ? { left: 0, right: 0, top: 0, bottom: 0 } : false}
      onDragEnd={isCurrentCard ? handleDragEnd : undefined}
      animate={getCardAnimation()}
      transition={getTransition()}
    >
      {/* Category Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-600">
          {outfit.category}
        </p>
      </div>

      {/* Outfit Image */}
      <div className="relative flex-1 bg-gray-100 min-h-[400px]">
        <Image
          src={outfit.image}
          alt={outfit.name}
          fill
          className="object-contain p-4"
          priority
        />
      </div>

      
    </motion.div>
  )
}

export default OutfitSwipe
