import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

async function checkUserExists(userId:number):Promise<boolean>{
    const{data, error}= await supabase
    .from('user_outfits')
    .select('main_outfit_id')
    .eq('user_id', userId);
    
    return !!data;
}

export async function POST(req:NextRequest){
    const {user_id, regenerate} = await req.json();
    if(!user_id){
        return NextResponse.json({error:"user_id missing"}, {status:400});
    }
    
    // Use the regenerate parameter from frontend if provided, otherwise check if user exists
    let shouldRegenerate = regenerate;
    if (regenerate === undefined) {
        const userExists = await checkUserExists(user_id);
        shouldRegenerate = userExists;
    }
    
    const payload={
        user_id:user_id,
        regenerate: shouldRegenerate,
    }
    
    try{
        const response= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/outfits/generate`, {
            method:'POST',
            headers:{
               'Content-Type': 'application/json',
               'accept': 'application/json',

            },
            body: JSON.stringify(payload)

        })
        const data= await response.json();
        return NextResponse.json(data, {status:response.status})
    }
    catch(err){
        console.log("Api error: ", err);
        return NextResponse.json({error:'Failed to generate outfits'}, {status:500});
    }
}