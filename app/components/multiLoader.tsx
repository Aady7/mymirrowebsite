'use client'
import LoaderOne from "./loader/loderOne";
import LoaderTwo from "./loader/loaderTwo";
import LoaderThree from "./loader/loaderThree";
import LoaderFour from "./loader/loaderFour";
import LoaderFive from "./loader/loaderFive";
import { useEffect, useState, ReactNode } from "react";

interface MultiLoaderProps {
  children?: ReactNode;
}

const MultiLoader = ({ children }: MultiLoaderProps) => {
    const[loaderIndex,setLoaderIndex]=useState(0);
    const[isVisible,setIsVisible]=useState(false);
    const[isTransitioning,setIsTransitioning]=useState(false);
    const[isInitialized,setIsInitialized]=useState(false);
    const[hasStarted,setHasStarted]=useState(false);

    useEffect(()=>
    {
        // Small delay to ensure component is fully mounted before starting
        const startDelay = setTimeout(() => {
            setHasStarted(true);
        }, 50);

        // Initial fade-in delay for first loader
        const initialDelay = setTimeout(() => {
            setIsInitialized(true);
        }, 150);

        const maxLoader=5;
        const loaderDelay=3000;//milisecond
        const contentDelay=600;//milisecond
        const transitionDelay=400;//milisecond for fade transition
        
        const interval=setInterval(()=>{
            setIsTransitioning(true);
            
            setTimeout(() => {
                setLoaderIndex((prev)=>{
                    const next=prev+1;
                    if(next>=maxLoader)
                    {
                        clearInterval(interval);
                        setTimeout(()=>
                        {
                            setIsVisible(true);
                        },contentDelay);
                    }
                    return next;
                });
                setIsTransitioning(false);
            }, transitionDelay);
        },loaderDelay);
        
        return ()=>{
            clearInterval(interval);
            clearTimeout(initialDelay);
            clearTimeout(startDelay);
        };
    },[]);

    // Don't render anything until the loader has started
    if(!hasStarted){
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                {/* Empty loading state */}
            </div>
        );
    }

    if(!isVisible){
        return(
            <div className="flex items-center justify-center min-h-screen relative">
                <div className={`absolute transition-opacity duration-400 ease-in-out ${loaderIndex===0 && !isTransitioning && isInitialized ? 'opacity-100' : 'opacity-0'}`}>
                    <LoaderOne/>
                </div>
                <div className={`absolute transition-opacity duration-400 ease-in-out ${loaderIndex===1 && !isTransitioning ? 'opacity-100' : 'opacity-0'}`}>
                    <LoaderTwo/>
                </div>
                <div className={`absolute transition-opacity duration-400 ease-in-out ${loaderIndex===2 && !isTransitioning ? 'opacity-100' : 'opacity-0'}`}>
                    <LoaderThree/>
                </div>
                <div className={`absolute transition-opacity duration-400 ease-in-out ${loaderIndex===3 && !isTransitioning ? 'opacity-100' : 'opacity-0'}`}>
                    <LoaderFour/>
                </div>
                <div className={`absolute transition-opacity duration-400 ease-in-out ${loaderIndex===4 && !isTransitioning ? 'opacity-100' : 'opacity-0'}`}>
                    <LoaderFive/>
                </div>
            </div>
        );
    }

    // Return children after loading is complete with fade-in effect
    return (
        <div className="transition-opacity duration-500 ease-in-out opacity-100">
            {children}
        </div>
    );
};
export default MultiLoader