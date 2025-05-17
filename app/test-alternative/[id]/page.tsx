import StylistSays from '@/app/components/stylistSays'
import TexturePrint from '@/app/components/texturePrint'
import React from 'react'

export default function Page({ params }: { params: { id: string } }) {
    // We're deliberately ignoring TypeScript here as a workaround
    // @ts-ignore
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