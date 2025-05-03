'use client'
import React from 'react'
import { useParams } from 'next/navigation'

const Checkout = () => {
    const {id}=useParams();
  return (
    <div>CheckOut Page</div>
  )
}

export default Checkout