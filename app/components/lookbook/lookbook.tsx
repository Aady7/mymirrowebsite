"use client";

import LookBookBanner from "./lookbookbanner";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { StyleQuizData } from "@/lib/hooks/useStyleQuizData";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type LookbookItem = {
  id: string;
  title: string;
  outfitImage: string[];
};

const LookBook = () => {
  const [lookbook, setLookbook] = useState<LookbookItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string[]>([
    "/assets/look-11.png",
    "/assets/tex-2.png",
  ]);
  const [user, setUser] = useState<User | null>(null);
  const { getSession } = useAuth();
  const [showPopup, setPopup] = useState(false);
  const [name, setName] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  //chek the session id of the user
  useEffect(() => {
    const checkSession = async () => {
      const { session } = await getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    checkSession();
  }, [getSession]);

  //to add a new card
  const handleAddNewCard = async () => {
    /* if (!gridRef.current) {
      return;
    } 
     const canvas = await html2canvas(gridRef.current);
    const imageData = canvas.toDataURL("image/png");*/

    const newLook: LookbookItem = {
      id: Date.now().toString(),
      title: name,
      outfitImage: selectedImage,
    };
    // Add new card to the end (bottom) so it appears at the bottom of the stack
    setLookbook((prev) => [...prev, newLook]);
    setPopup(false);
    setName("");
  };
  //to delete the card
  const handleDelete = (id: string) => {
    setLookbook((prev) => prev.filter((card) => card.id !== id));
  };
  //to edit the card
  const handleEdit = (id: number) => {
    console.log("Edit card with Id:", id);
  };

  function getColorByIndex(index: number) {
    const colors = ["#D4BA9E", "#F6EF6B", "#68C79C", "#B58DDC"]; // add more if needed
    return colors[index % colors.length];
  }

  return (
    <>
      <LookBookBanner />

      {/* card section */}
      <div className="px-5 mt-[-45px] mb-10">
        {/* Heading */}
        <h1 className="text-[25px] text-black font-bold tracking-wider uppercase">
          Your Lookbook
        </h1>

        {/* Card Container (Stack) */}
        <div className="relative mt-6">
          {lookbook.length === 0 ? (
            <div className="px-4 mt-10 flex flex-col items-center justify-center">
              <Image
                src="/assets/lookbookEmpty.svg"
                alt="Empty"
                width={100}
                height={100}
                className="w-full h-full"
              />
               <h1 className="mt-10 pl-2 text-center align-center uppercase text-black text-md font-semibold">
                Looks like your Lookbook’s on vacation 👀 Time to add some fire
                fits!
              </h1>
            </div>
            
          ) : null}
          {lookbook.map((card, idx) => (
            <div
              key={card.id}
              className={`relative w-[100%] rounded-xl p-4 shadow-lg transition-transform duration-300 mb-4`}
              style={{
                marginTop: idx === 0 ? 0 : -340, // Stack cards with negative margin
                zIndex: idx + 1, // Higher index = higher z-index (newer cards on top)
                backgroundColor: getColorByIndex(idx),
                transform: `translateY(${idx * 10}px)`, // Additional visual stacking
              }}
            >
              {/* Card Header */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-white font-semibold uppercase text-sm">
                  {card.title}
                </p>
                <div className="flex gap-2">
                  <button
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow hover:scale-105 transition border-1 border-black"
                    onClick={() => handleEdit(idx)}
                  >
                    ✏️
                  </button>
                  <button
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow hover:scale-105 transition border-1 border-black"
                    //onClick={() => handleEdit(card.id)}
                  >
                    📎
                  </button>
                  <button
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow hover:scale-105 transition border-1 border-black"
                    onClick={() => handleDelete(card.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Card Image - positioned below the header buttons */}
              <div className="w-full h-full bg-white rounded-lg overflow-hidden flex gap-1">
                {card.outfitImage.map((cardImage, i) => (
                  <img
                    key={i}
                    src={cardImage}
                    alt="Outfit"
                    className="object-cover w-1/2 h-[300px] border-2 border-black rounded-lg"
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Add New Card Button - positioned at bottom-right corner over the newest card */}
          <div
            className="relative"
            style={{
              marginTop: lookbook.length > 0 ? -40 : 0,
              zIndex: lookbook.length + 2, // Higher than the newest card
              width: "100%",
              height: "200px",
            }}
          >
            <button
              onClick={() => setPopup(true)}
              className="absolute bottom-[120px] right-[-10px] w-15 h-15 bg-white rounded-full border-1 border-gray-400 shadow-xl flex items-center justify-center text-5xl font-bold hover:scale-105 transition pointer-events-auto"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* to the slide up popup menu for adding the cards */}
      {showPopup && (
        <div className="fixed inset-0  bg-opacity-60 z-50 flex items-end justify-center">
          <div className="bg-black w-full max-w-md rounded-t-2xl p-6 text-white animate-slide-up">
            <button
              className="text-white text-3xl mb-2"
              onClick={() => setPopup(false)}
            >
              &times;
            </button>

            <div className="px-4 w-full h-50 bg-black rounded-xl mb-6">
              <div
                // ref={gridRef}
                className=" grid grid-cols-2 gap-1 border-8 shadow-xl bg-white rounded-xl   w-full h-[200px] overflow-hidden"
              >
                {/* example */}
                {selectedImage.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Preview ${i + 1}`}
                    className="object-cover w-full h-full border border-black"
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-300 mb-6 px-8">
              Here's how your cover looks right now. Wanna make it so you?
            </p>
            <div className="flex items-center justify-center">
              <Button className="text-sm bg-gray-100 text-black rounded-md px-4 py-2 mb-6">
                Create Your Own Cover
              </Button>
            </div>

            <div className="mb-4 mt-6 px-8">
              <label className="text-sm font-semibold">
                Name Your Lookbook
              </label>
              <p className="text-[10px] text-gray-400 mb-3">
                Give your Lookbook a name that screams your vibe.
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border-b border-white focus:outline-none py-2 text-white"
                placeholder=""
              />
            </div>

            <div className="flex items-center justify-center mt-10 ">
              <Button
                onClick={() => {
                  handleAddNewCard(), setPopup(false);
                }}
                className={`text-sm uppercase bg-gray-100 text-black rounded-md px-4 py-2 mb-2 w-25  `}
              >
                save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default LookBook;
