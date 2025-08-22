// Interface for Supabase lookbook table
export interface LookbookRecord {
  id?: number; // auto-incrementing primary key
  created_at?: string; // timestamp, auto-generated
  user_id: string; // UUID for the user
  name: string | null; // lookbook name
  color: string | null; // color theme
  avatar: string | null; // avatar/image URL
  visibility: number | null; // visibility setting (0 = private, 1 = public, etc.)
  outfits: string | null; // JSON string of outfits (will be populated later)
  products: string | null; // JSON string of products (will be populated later)
  shareUrl: string | null; // share URL for the lookbook
}

// Interface for the local lookbook item (used in component state)
export interface LookbookItem {
  id: string;
  title: string;
  characterImage: string; // Main character/avatar image to display
  characterData?: any; // Full character object for editing
  color?: string;
  visibility?: number;
  shareUrl?: string;
  avatarSticker?: string; // sticker name for database storage
  avatarStickerUrl?: string; // sticker URL for display
}

// Interface for creating a new lookbook (without auto-generated fields)
export interface CreateLookbookRequest {
  user_id: string;
  name: string;
  color?: string;
  avatar?: string; // This will store the sticker name
  visibility?: number;
  outfits?: string; // Can store character data as JSON
  products?: string;
  shareUrl?: string;
}
