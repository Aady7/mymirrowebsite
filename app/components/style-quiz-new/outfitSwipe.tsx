'use client'

import React, { useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import Image from 'next/image'
import SingleViewportLayout from './SingleViewportLayout'

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
  // Define outfits based on gender
  const getOutfits = (): OutfitData[] => {
    const maleOutfits = [
      {
        id: 'casual',
        name: 'Casual',
        image: '/assets/newstylequizimages/menSwipe/menCasual.svg',
        category: 'Casual'
      },
      {
        id: 'streetwear',
        name: 'Streetwear',
        image: '/assets/newstylequizimages/menSwipe/menStreetWear.svg',
        category: 'Streetwear'
      },
      {
        id: 'formal',
        name: 'Formal',
        image: '/assets/newstylequizimages/menSwipe/menformal.svg',
        category: 'Formal'
      },
      {
        id: 'business-casual',
        name: 'Business Casual',
        image: '/assets/newstylequizimages/menSwipe/menBusinessCasual.svg',
        category: 'Business'
      },
      {
        id: 'athleisure',
        name: 'Athleisure',
        image: '/assets/newstylequizimages/menSwipe/menAthleisure.svg',
        category: 'Athletic'
      },
      {
        id: 'high-street-casual',
        name: 'High Street Casual',
        image: '/assets/newstylequizimages/menSwipe/menHighStreenCasual.svg',
        category: 'High Street'
      },
      {
        id: 'resort-look',
        name: 'Resort Look',
        image: '/assets/newstylequizimages/menSwipe/menResortLook.svg',
        category: 'Resort'
      },
      {
        id: 'oversized',
        name: 'Oversized',
        image: '/assets/newstylequizimages/menSwipe/menoversized.svg',
        category: 'Oversized'
      }
    ]

    const femaleOutfits = [
      {
        id: 'casual',
        name: 'Casual',
        image: '/assets/newstylequizimages/womenSwipe/casual.svg',
        category: 'Casual'
      },
      {
        id: 'formal',
        name: 'Formal',
        image: '/assets/newstylequizimages/womenSwipe/formal.svg',
        category: 'Formal'
      },
      {
        id: 'business-casual',
        name: 'Business Casual',
        image: '/assets/newstylequizimages/womenSwipe/businessCasual.svg',
        category: 'Business'
      },
      {
        id: 'athleisure',
        name: 'Athleisure',
        image: '/assets/newstylequizimages/womenSwipe/athleisure.svg',
        category: 'Athletic'
      },
      {
        id: 'high-street',
        name: 'High Street',
        image: '/assets/newstylequizimages/womenSwipe/highStreet.svg',
        category: 'High Street'
      },
      {
        id: 'summer-dress',
        name: 'Summer Dress',
        image: '/assets/newstylequizimages/womenSwipe/summerDress.svg',
        category: 'Summer'
      },
      {
        id: 'little-black-dress',
        name: 'Little Black Dress',
        image: '/assets/newstylequizimages/womenSwipe/littleBlackDress.svg',
        category: 'Evening'
      },
      {
        id: 'desi-core',
        name: 'Desi Core',
        image: '/assets/newstylequizimages/womenSwipe/desiCore.svg',
        category: 'Traditional'
      }
    ]

    // Return outfits based on gender
    if (gender === 'Female') {
      return femaleOutfits
    } else {
      // Default to male outfits for 'Male', 'Other', or empty
      return maleOutfits
    }
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
      <SingleViewportLayout
        onNext={() => onNext({ likedOutfits, dislikedOutfits, superLikedOutfits })}
        onBack={onBack}
        currentStep={currentStep}
        totalSteps={totalSteps}
        isFormValid={true}
        nextButtonText="Continue"
        showBackButton={currentStep > 1}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-[26px] font-[700] leading-[100%] tracking-[-0.02em] text-black mb-4">
              Great choices! 
            </h2>
            <p className="text-[14px] font-[400] leading-[100%] tracking-[-0.02em] text-gray-600 mb-6">
              You've reviewed all outfits. Let's continue with your style journey.
            </p>
          </div>
        </div>
      </SingleViewportLayout>
    )
  }

  return (
    <SingleViewportLayout
      onNext={() => onNext({ likedOutfits, dislikedOutfits, superLikedOutfits })}
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isFormValid={true}
      nextButtonText="Continue"
      showBackButton={currentStep > 1}
    >
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
      <div className="relative flex-1 flex justify-center">
        <div className="relative w-full max-w-sm mb-10" style={{ minHeight: '400px' }}>
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
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-[85px] h-[85px] bg-white rounded-[42.5px]  flex items-center justify-center shadow-lg z-50 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 active:scale-95" 
            style={{ paddingTop: '28.33px', paddingRight: '26.07px', paddingBottom: '28.33px', paddingLeft: '26.07px' }}
            disabled={isCardExiting}
          >
            <span className="text-2xl">🤌</span>
          </button>
        </div>
      </div>
    </SingleViewportLayout>
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
          cursor: 'grab'
        }),
        ...(!isCurrentCard && {
          backgroundColor: 'transparent'
        })
      }}
      drag={isCurrentCard ? true : false}
      dragConstraints={isCurrentCard ? { left: 0, right: 0, top: 0, bottom: 0 } : false}
      onDragEnd={isCurrentCard ? handleDragEnd : undefined}
      animate={getCardAnimation()}
      transition={getTransition()}
    >
      {/* Full Screen Outfit Image */}
      <div className="relative w-full h-full bg-white">
        <Image
          src={outfit.image}
          alt={outfit.name}
          fill
          className="object-cover"
          style={{ objectPosition: 'center 5%' }}
          priority
        />
      </div>
    </motion.div>
  )
}

export default OutfitSwipe
