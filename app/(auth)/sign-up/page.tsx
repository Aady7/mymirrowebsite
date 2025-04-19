'use client'
import React from 'react'
import supabase from '@/lib/supabaseClient'
import { redirect } from 'next/navigation'
import { useState } from 'react'

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    
    const handleSignUp= async()=>{
        const {data, error}= await supabase.auth.signUp({
            email,
            password
        })
        if(error){
            setError(error.message)
        }   
        else{
            redirect('/sign-in')
        }
    }

    
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold'>Sign Up</h1>
        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSignUp}>Sign Up</button>
        {error && <p>{error}</p>}
    </div>
  )
}

export default SignUp