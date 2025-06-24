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
    const {user_id}= await req.json();
    if(!user_id){
        return NextResponse.json({error:"user_id missing"}, {status:400});
    }
    const userExists=checkUserExists(user_id);
    const payload={
        user_id:user_id,
        regenerate:userExists,

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