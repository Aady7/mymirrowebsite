"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { Character } from "./character";


interface EditLookBookProps {
  item: {
    id: string;
    title: string;
    outfitImage: string[];
  };
  onClose: () => void;
}

const EditLookBook = ({ item, onClose }: EditLookBookProps) => {
  const [showCharacterPopup, setShowCharacterPopup] = useState(false);
  const [showStickerPopup, setShowStickerPopup] = useState(false);
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const[loading,setloading]=useState(false);
  const presetColors = [
    "#ff0000",
    "#ff8000",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#8000ff",
    "#ff00ff",
    "#cccccc",
    "#a084ca",
  ];
  
  const [selectedColor, setSelectedColor] = useState(presetColors[9]);
  const [sliderValue, setSliderValue] = useState(90); // default to last color

  return (
    <>
      <div className="bg-black text-white">
        {/*just to add a line height  */}
        <div className="min-h-5"></div>

        {/*Button zone */}
        <div className="p-2 flex flex-row items-center justify-between mt-5">
          <Button
            onClick={onClose}
            className="text-white bg-black text-sm font-semibold leading-normal font-[Boston]"
          >
            Cancel
          </Button>
          <Button className="text-white bg-black text-sm font-semibold leading-normal font-[Boston]">
            Create your cover
          </Button>
          <Button
            onClick={() => setShowSave(true)}
            className="text-white bg-black text-sm font-semibold leading-normal font-[Boston]"
          >
            {" "}
            Save
          </Button>
        </div>

        {/*backround image */}
        <div className="mt-2 mb-10">
          <Image
            src="/assets/editback.svg"
            alt="background image"
            width={150}
            height={90}
            className="object-cover w-full h-full p-4"
          />
        </div>

        {/* character component background component and add sticker commnonent*/}
        <div className="p-2 bg-[#1F1F1F] flex flex-row items-center justify-between mt-10 h-25 rounded-t-2xl">
          <Button
            className="text-white bg-[#1F1F1F] flex flex-col  text-sm font-semibold leading-normal font-[Boston]"
            onClick={() => setShowCharacterPopup(true)}
          >
            <Image
              src="/assets/charactersvg.svg"
              alt="character"
              width={150}
              height={90}
              className="w-8 h-8 border-2 rounded-sm"
            />
            Character
          </Button>
          <Button
            className="text-white bg-[#1F1F1F] flex flex-col  text-sm font-semibold leading-normal font-[Boston]"
            onClick={() => setShowColorPopup(true)}
          >
            <Image
              src="/assets/background.svg"
              alt="character"
              width={150}
              height={90}
              className="w-8 h-8"
            />
            Background
          </Button>
          <Button
            className="text-white  bg-[#1F1F1F] flex flex-col  text-sm font-semibold leading-normal font-[Boston]"
            onClick={() => setShowStickerPopup(true)}
          >
            <Image
              src="/assets/sticker1.svg"
              alt="character"
              width={150}
              height={90}
              className="w-8 h-8"
            />{" "}
            Stickers
          </Button>
        </div>
      </div>
      {/*save popup section */}
      {showSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60">
          <div className="bg-white rounded-xl p-6 w-[320px] text-center sclae-90 animate-sclae-in ">
            <h2 className="text-black text-center font-[Boston] text-[14px] not-italic font-semibold leading-none">
              Ready to lock it in?
            </h2>
            <p className=" mt-4 text-black text-center font-[Boston] text-[14px] not-italic font-semibold leading-none">
              Once you save, this design can’t be edited. Make sure it’s just
              how you want it!
            </p>
            <div className="flex flex-col items-center justify-center border-gray-700 pt-4 gap-8 mt-4">
              <button onClick={()=>{setShowSave(false),setloading(!loading)}} className= {`w-18 h-10 rounded-lg text-black text-center font-[Boston] text-[14px] not-italic font-semibold leading-none ${loading ? 'bg-gray-300':'bg-white'}`}>
                { loading ?"Save":"Save"}
              </button>
              <button onClick={()=>{setShowSave(false),setloading(!loading)}} className= {`w-18 h-10 rounded-lg text-black text-center font-[Boston] text-[14px] not-italic font-semibold leading-none ${loading ? 'bg-gray-300':'bg-white'}`}>
                {loading?"Go Back":"Go Back"} 
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Character selection popup */}
      {showCharacterPopup && (
        <div className="fixed inset-0  bg-opacity-70 z-[9999] flex items-end justify-center">
          <div className="bg-[#222] rounded-t-xl p-6 animate-slide-up w-full max-w-md">
            <div className="flex items-center justify-center">
              {" "}
              <h2 className="text-white text-lg mb-4">Character</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {Character.map((char) => (
                <img
                  key={char.id}
                  src={char.image}
                  alt={`Character ${char.id}`}
                  onClick={() => setShowCharacterPopup(false)}
                  className="w-20 h-20 rounded-lg cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticker selection popup */}
      {showStickerPopup && (
        <div className="fixed inset-0 bg-opacity-70 z-[9999] flex items-end justify-center">
          <div className="bg-[#222] rounded-t-xl p-6 animate-slide-up w-full max-w-md">
            <div className="flex items-center justify-center">
              <h2 className="text-white text-lg mb-4">Stickers</h2>
            </div>
            <div className="h-32 flex items-center justify-center text-gray-400">
              {/* Blank area for future stickers */}
              No stickers available yet.
            </div>
            <button
              className="mt-4 text-white bg-red-500 px-4 py-2 rounded mx-auto block"
              onClick={() => setShowStickerPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Background color popup */}
      {showColorPopup && (
        <div className="fixed inset-0 bg-opacity-70 z-[9999] flex items-end justify-center">
          <div className="bg-[#222] rounded-t-xl p-6 animate-slide-up w-full max-w-md">
            <div className="flex items-center justify-center">
              <h2 className="text-white text-lg mb-4">Colour</h2>
            </div>
            {/* Preset color grid */}
            <div className="grid grid-cols-5 gap-3 mb-4">
              {presetColors.map((color, idx) => (
                <button
                  key={color}
                  className={`w-7 h-7 rounded-full border-2 border-white focus:outline-none ${
                    selectedColor === color ? "ring-2 ring-white" : ""
                  }`}
                  style={{ background: color }}
                  onClick={() => {
                    setSelectedColor(color);
                    setSliderValue(idx * 10);
                  }}
                />
              ))}
            </div>
            {/* Color slider */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="range"
                min="0"
                max="90"
                step="10"
                value={sliderValue}
                className="w-full accent-[#a084ca]"
                onChange={(e) => {
                  setSliderValue(Number(e.target.value));
                  setSelectedColor(
                    presetColors[Math.round(Number(e.target.value) / 10)]
                  );
                }}
              />
              <div
                className="w-6 h-6 rounded-full border-2 border-white"
                style={{ background: selectedColor }}
              ></div>
            </div>
            {/* Color preview */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-white text-xs">Colour</span>
              <div
                className="w-6 h-6 rounded-full border-2 border-white"
                style={{ background: selectedColor }}
              ></div>
            </div>
            <button
              className="mt-4 text-white bg-red-500 px-4 py-2 rounded mx-auto block"
              onClick={() => setShowColorPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default EditLookBook;
