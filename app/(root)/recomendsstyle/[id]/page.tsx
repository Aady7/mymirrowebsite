import StylistSays from '@/app/components/stylistSays'
import TexturePrint from '@/app/components/texturePrint'
import React from 'react'

type Params = {
    params: {
        id: string
    }
}

const Page = ({ params }:Params) => {
  return (
    <>
      {params?.id ==='stylistSays' ? 
      <StylistSays/> : 
      params?.id==='texturePrint' ?
      <TexturePrint/> : null
    }
    
    
    </>
  )
}

export default Page
