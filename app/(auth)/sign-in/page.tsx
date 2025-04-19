'use client'
import React, { useState } from 'react'
import supabase from '@/lib/supabaseClient'

import { redirect } from 'next/navigation'

const SignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSignIn = async () => {
        const{data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if(error){
            setError(error.message)
        }
        else{
            redirect('/style-quiz')
        }
    }
  
    
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold'>Sign In</h1>
        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSignIn}>Sign In</button>
        {error && <p>{error}</p>}
    </div>

  
  )
}

export default SignIn