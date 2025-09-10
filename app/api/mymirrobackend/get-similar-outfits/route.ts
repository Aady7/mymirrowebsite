import { NextResponse, NextRequest } from "next/server";
export async function GET(req:NextRequest){
    const{searchParams}=new URL(req.url);
    const id=searchParams.get('id');
    const count = searchParams.get('count');
    console.log("id and count",id, count);
    console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
    
    if(!id){
        return NextResponse.json({error:"Missing outfit ID"}, {status:400});
    }
    
    // Check if base URL is defined
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
        console.error("NEXT_PUBLIC_BASE_URL is not defined!");
        return NextResponse.json({error:"Backend URL not configured"}, {status:500});
    }
    
    const apiurl=`${process.env.NEXT_PUBLIC_BASE_URL}/outfits/${id}/similar${count?`?count=${count}`:''}`;
    console.log("api url is ", apiurl);

    try{
        const res= await fetch(apiurl,{
            method:'GET',
            headers:{
                accept: 'application/json',
                
                

            }
        });
        const data= await res.json();
        return NextResponse.json(data, {status:res.status})
    }
    catch(err){
        console.log("Failed to fetch similar outfits: ", err);
        return NextResponse.json({error:'Failed to fetch similar outfits'},{status:500});
    }

}