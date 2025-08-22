"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { Character } from "./character";
import { stickerMapping, StickerData } from "@/app/data/stickerMapping";


interface EditLookBookProps {
  item: {
    id: string;
    title: string;
    characterImage: string;
    characterData?: any;
    color?: string;
    avatarSticker?: string;
  };
  onClose: () => void;
  onSave?: (lookbookId: string, updatedData: {
    color: string;
    avatarSticker: string;
    title: string;
    selectedCharacter: any;
  }) => void;
}

const EditLookBook = ({ item, onClose, onSave }: EditLookBookProps) => {
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

  // Helper function to convert hex color to HSL and adjust lightness
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Helper function to convert HSL back to hex
  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Helper function to adjust color brightness
  const adjustColorBrightness = (hex: string, brightness: number) => {
    const hsl = hexToHsl(hex);
    // Adjust lightness based on brightness (0-100 scale)
    const adjustedLightness = Math.max(5, Math.min(95, brightness));
    const resultColor = hslToHex(hsl.h, hsl.s, adjustedLightness);
    console.log(`Adjusting ${hex} with brightness ${brightness}% -> ${resultColor}`);
    return resultColor;
  };

  // Helper function to extract color and brightness
  const parseColorAndBrightness = (colorString: string) => {
    // If it's already processed with brightness, extract base color
    // For now, assume it's a hex color and default brightness is 50%
    if (colorString.startsWith('#')) {
      const hsl = hexToHsl(colorString);
      return { color: colorString, brightness: Math.round(hsl.l) };
    }
    // Default fallback
    return { color: colorString, brightness: 50 };
  };
  
  // Initialize color and brightness from item
  const initialColorData = parseColorAndBrightness(item.color || presetColors[9]);
  const [selectedColor, setSelectedColor] = useState(initialColorData.color);
  const [colorBrightness, setColorBrightness] = useState(initialColorData.brightness);
  const [selectedSticker, setSelectedSticker] = useState<StickerData>(
    stickerMapping.find(s => s.name === item.avatarSticker) || stickerMapping[0]
  );
  const [lookbookTitle, setLookbookTitle] = useState(item.title);
  const [selectedCharacter, setSelectedCharacter] = useState(
    item.characterData || Character.find(char => char.image === item.characterImage) || Character[0]
  );

  const handleSave = () => {
    if (onSave) {
      onSave(item.id, {
        color: adjustColorBrightness(selectedColor, colorBrightness), // Save color with brightness adjustment
        avatarSticker: selectedSticker.name,
        title: lookbookTitle,
        selectedCharacter: selectedCharacter,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black text-white animate-slide-up pb-24">
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

        {/* Live Preview Canvas */}
        <div className="mt-2 mb-10 p-4">
          <div 
            className="relative w-full h-64 rounded-2xl overflow-hidden shadow-xl mx-auto max-w-sm"
            style={{ backgroundColor: adjustColorBrightness(selectedColor, colorBrightness) }}
          >
            {/* Grid pattern overlay - matching reference image */}
            <div className="absolute inset-0 opacity-40">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-white/50"></div>
                ))}
              </div>
            </div>

            {/* White semicircle background */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 bg-white rounded-t-full"></div>

            {/* Main Character Display - centered and larger like reference */}
            {selectedCharacter && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-32 z-20">
                <Image
                  src={selectedCharacter.image}
                  alt="Character"
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Decorative stickers around character - like reference image */}
            <div className="absolute top-16 left-6 w-8 h-8 z-10">
              <Image
                src={selectedSticker.image}
                alt="Sticker"
                fill
                className="object-contain opacity-80"
              />
            </div>
            <div className="absolute top-20 right-8 w-6 h-6 z-10">
              <Image
                src={selectedSticker.image}
                alt="Sticker"
                fill
                className="object-contain opacity-60"
              />
            </div>
            <div className="absolute bottom-16 left-8 w-7 h-7 z-10">
              <Image
                src={selectedSticker.image}
                alt="Sticker"
                fill
                className="object-contain opacity-70"
              />
            </div>
            <div className="absolute bottom-20 right-6 w-8 h-8 z-10">
              <Image
                src={selectedSticker.image}
                alt="Sticker"
                fill
                className="object-contain opacity-80"
              />
            </div>

            {/* Title */}
            <div className="absolute top-4 left-4 right-4 z-30">
              <h3 className="text-white font-bold text-sm uppercase truncate">
                {lookbookTitle || "My Lookbook"}
              </h3>
            </div>

            {/* Edit and Delete buttons - like reference */}
            <div className="absolute top-4 right-4 flex gap-2 z-30">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs">
                ✏️
              </div>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs">
                🗑️
              </div>
            </div>
          </div>
        </div>

        {/* Edit title section */}
        <div className="p-4 mb-4">
          <label className="text-white text-sm font-semibold block mb-2">
            Lookbook Title
          </label>
          <input
            type="text"
            value={lookbookTitle}
            onChange={(e) => setLookbookTitle(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter lookbook title"
          />
        </div>

        {/* Bottom Controls - Fixed at bottom of screen */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#1F1F1F] grid grid-cols-3 gap-4 z-50 border-t border-gray-700">
          <Button
            className="text-white bg-[#2A2A2A] flex flex-col text-xs font-semibold leading-normal font-[Boston] p-4 rounded-lg"
            onClick={() => setShowCharacterPopup(true)}
          >
            <Image
              src={selectedCharacter?.image || "/assets/charactersvg.svg"}
              alt="character"
              width={40}
              height={40}
              className="w-10 h-10 border-2 border-white rounded-sm mb-2"
            />
            Character
          </Button>
          <Button
            className="text-white bg-[#2A2A2A] flex flex-col text-xs font-semibold leading-normal font-[Boston] p-4 rounded-lg"
            onClick={() => setShowColorPopup(true)}
          >
            <div 
              className="w-10 h-10 rounded border-2 border-white mb-2"
              style={{ backgroundColor: adjustColorBrightness(selectedColor, colorBrightness) }}
            ></div>
            Background
          </Button>
          <Button
            className="text-white bg-[#2A2A2A] flex flex-col text-xs font-semibold leading-normal font-[Boston] p-4 rounded-lg"
            onClick={() => setShowStickerPopup(true)}
          >
            <Image
              src={selectedSticker.image}
              alt="sticker"
              width={40}
              height={40}
              className="w-10 h-10 mb-2"
            />
            Stickers
          </Button>
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
              <button 
                onClick={() => {
                  setloading(true);
                  setTimeout(() => {
                    handleSave();
                    setloading(false);
                    setShowSave(false);
                  }, 1000);
                }}
                disabled={loading}
                className={`w-18 h-10 rounded-lg text-black text-center font-[Boston] text-[14px] not-italic font-semibold leading-none ${loading ? 'bg-gray-300':'bg-white'}`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button 
                onClick={() => setShowSave(false)} 
                disabled={loading}
                className={`w-18 h-10 rounded-lg text-black text-center font-[Boston] text-[14px] not-italic font-semibold leading-none ${loading ? 'bg-gray-300':'bg-white'}`}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Character selection popup */}
      {showCharacterPopup && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] flex items-end justify-center">
          <div className="bg-[#222] rounded-t-xl p-6 animate-slide-up w-full max-w-md mb-20 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg">Character</h2>
              <button
                className="text-white text-xl"
                onClick={() => setShowCharacterPopup(false)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {Character.map((char) => (
                <div
                  key={char.id}
                  className={`relative cursor-pointer p-2 rounded-lg border-2 transition-all ${
                    selectedCharacter.id === char.id 
                      ? 'border-white bg-gray-700' 
                      : 'border-transparent hover:border-gray-500'
                  }`}
                  onClick={() => {
                    setSelectedCharacter(char);
                  }}
                >
                  <img
                    src={char.image}
                    alt={`Character ${char.id}`}
                    className="w-full h-16 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticker selection popup */}
      {showStickerPopup && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] flex items-end justify-center">
          <div className="bg-[#222] rounded-t-xl p-6 animate-slide-up w-full max-w-md mb-20 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg">Stickers</h2>
              <button
                className="text-white text-xl"
                onClick={() => setShowStickerPopup(false)}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 max-h-48">
              {stickerMapping.map((sticker) => (
                <div
                  key={sticker.id}
                  className={`relative cursor-pointer p-2 rounded-lg border-2 transition-all ${
                    selectedSticker.id === sticker.id 
                      ? 'border-white bg-gray-700' 
                      : 'border-transparent hover:border-gray-500'
                  }`}
                  onClick={() => {
                    setSelectedSticker(sticker);
                  }}
                >
                  <Image
                    src={sticker.image}
                    alt={sticker.displayName}
                    width={60}
                    height={60}
                    className="w-full h-16 object-contain"
                  />
                  <p className="text-xs text-center mt-1 text-gray-300">
                    {sticker.displayName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Background color popup */}
      {showColorPopup && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] flex items-end justify-center">
          <div className="bg-[#222] rounded-t-xl p-6 animate-slide-up w-full max-w-md mb-20 max-h-80">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg">Colour</h2>
              <button
                className="text-white text-xl"
                onClick={() => setShowColorPopup(false)}
              >
                ✕
              </button>
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
                  }}
                />
              ))}
            </div>
            {/* Brightness slider */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white text-xs w-12">Brightness</span>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={colorBrightness}
                className="w-full accent-[#a084ca]"
                onChange={(e) => {
                  setColorBrightness(Number(e.target.value));
                }}
              />
              <div
                className="w-6 h-6 rounded-full border-2 border-white"
                style={{ background: adjustColorBrightness(selectedColor, colorBrightness) }}
              ></div>
              <span className="text-white text-xs w-8">{colorBrightness}%</span>
            </div>
            {/* Color preview */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-white text-xs">Preview</span>
              <div
                className="w-6 h-6 rounded-full border-2 border-white"
                style={{ background: adjustColorBrightness(selectedColor, colorBrightness) }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EditLookBook;
