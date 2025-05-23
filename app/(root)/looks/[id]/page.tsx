"use client"

import StylistSays from '@/app/components/stylistSays';
import TexturePrint from '@/app/components/texturePrint';
import UrbanShift from '@/app/components/urbanShift';
import { useParams } from 'next/navigation';
import React from 'react';
const Look = () => {

    const {id}=useParams();

      const componentMap: Record<string, React.FC> = {
    urban: UrbanShift,
    texture: TexturePrint,
    stylist: StylistSays,
  }
  const SelectedComponent = componentMap[id as string] || StylistSays
  return (
    <div > 
       <SelectedComponent />
    </div>
  )
}

export default Look;