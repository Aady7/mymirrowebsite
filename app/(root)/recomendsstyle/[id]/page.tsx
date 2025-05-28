import StylistSays from '@/app/components/recommendations/stylistSays'
import TexturePrint from '@/app/components/product-page/texturePrint'
import React from 'react'

// @ts-ignore - Deliberately bypassing type checking due to issues with Next.js types
export default function Page(props: any) {
  // Explicitly cast the params to the type we want using as
  const params = props.params as { id: string };

  return (
    <>
      {params.id === 'stylistSays' ?
        <StylistSays /> :
        params.id === 'texturePrint' ?
          <TexturePrint /> : null
      }
    </>
  )
}
