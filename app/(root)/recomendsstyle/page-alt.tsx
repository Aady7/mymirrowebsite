import StylistSays from '@/app/components/stylistSays'
import TexturePrint from '@/app/components/texturePrint'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function RecomendsstylesPage() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    return (
        <>
            {id === 'stylistSays' ?
                <StylistSays /> :
                id === 'texturePrint' ?
                    <TexturePrint /> : <div>Please specify a valid ID in the query parameters</div>
            }
        </>
    )
} 