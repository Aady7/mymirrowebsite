// Sticker mapping data for lookbook avatars
export interface StickerData {
  id: string;
  name: string;
  image: string;
  displayName: string;
}

export const stickerMapping: StickerData[] = [
  {
    id: "sticker_1",
    name: "geometric_pattern",
    image: "/assets/stickers/image_1.svg",
    displayName: "Geometric Pattern"
  },
  {
    id: "sticker_2", 
    name: "floral_design",
    image: "/assets/stickers/image_2.svg",
    displayName: "Floral Design"
  },
  {
    id: "sticker_3",
    name: "abstract_art",
    image: "/assets/stickers/image_3.svg", 
    displayName: "Abstract Art"
  },
  {
    id: "sticker_4",
    name: "minimalist_style",
    image: "/assets/stickers/image_4.svg",
    displayName: "Minimalist Style"
  },
  {
    id: "sticker_5",
    name: "vintage_classic",
    image: "/assets/stickers/image_5.svg",
    displayName: "Vintage Classic"
  },
  {
    id: "sticker_6",
    name: "modern_chic",
    image: "/assets/stickers/image_6.svg",
    displayName: "Modern Chic"
  }
];

// Helper function to get sticker by name
export const getStickerByName = (name: string): StickerData | undefined => {
  return stickerMapping.find(sticker => sticker.name === name);
};

// Helper function to get sticker by id
export const getStickerById = (id: string): StickerData | undefined => {
  return stickerMapping.find(sticker => sticker.id === id);
};

// Default sticker for new lookbooks
export const defaultSticker = stickerMapping[0];
