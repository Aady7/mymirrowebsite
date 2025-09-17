// Interface for Supabase lookbook table (enhanced with new fields)
export interface LookbookRecord {
  id?: number; // auto-incrementing primary key
  created_at?: string; // timestamp, auto-generated
  updated_at?: string; // timestamp for updates
  user_id: string; // UUID for the user
  name: string | null; // lookbook name
  color: string | null; // color theme
  avatar: string | null; // avatar/image URL (sticker name)
  custom_avatar_url?: string | null; // custom uploaded photo URL
  visibility: number | null; // visibility setting (0 = private, 1 = public, etc.)
  outfits: string | null; // JSON string of outfits (will be populated later)
  products: string | null; // JSON string of products (will be populated later)
  shareUrl: string | null; // share URL for the lookbook
  likes_count?: number; // total likes count
  views_count?: number; // total views count
  total_engagement_score?: number; // calculated engagement score
  is_premium?: boolean; // premium status
  creator_type?: 'user' | 'influencer' | 'celebrity'; // creator type
  verification_badge?: 'verified' | 'gold' | 'diamond' | null; // verification status
  bio?: string | null; // creator bio/description
  social_links?: string | null; // JSON string of social media links
  featured_until?: string | null; // timestamp for featured status
  price_tier?: 'free' | 'premium' | 'exclusive'; // pricing tier
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
  customAvatarUrl?: string; // custom uploaded photo URL
  creatorName?: string; // creator's name
  creatorType?: 'user' | 'influencer' | 'celebrity';
  verificationBadge?: 'verified' | 'gold' | 'diamond' | null;
  likesCount?: number;
  viewsCount?: number;
  isLiked?: boolean;
  isPremium?: boolean;
  priceTier?: 'free' | 'premium' | 'exclusive';
  bio?: string;
  socialLinks?: { instagram?: string; tiktok?: string; youtube?: string };
  creatorId?: string;
  totalEngagementScore?: number;
}

// Interface for creating a new lookbook (without auto-generated fields)
export interface CreateLookbookRequest {
  user_id: string;
  name: string;
  color?: string;
  avatar?: string; // This will store the sticker name
  custom_avatar_url?: string; // For uploaded custom avatars
  visibility?: number;
  outfits?: string; // Can store character data as JSON
  products?: string;
  shareUrl?: string;
  is_premium?: boolean;
  creator_type?: 'user' | 'influencer' | 'celebrity';
  verification_badge?: 'verified' | 'gold' | 'diamond' | null;
  bio?: string;
  social_links?: string; // JSON string
  price_tier?: 'free' | 'premium' | 'exclusive';
}

// Interface for social media links
export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  website?: string;
}

// Interface for lookbook likes
export interface LookbookLike {
  id: number;
  lookbook_id: number;
  user_id: string;
  created_at: string;
}

// Interface for lookbook views
export interface LookbookView {
  id: number;
  lookbook_id: number;
  user_id?: string | null;
  ip_address?: string;
  created_at: string;
  view_duration?: number;
}

// Interface for creator profiles (enhanced user info)
export interface CreatorProfile {
  user_id: string;
  display_name: string;
  bio?: string;
  custom_avatar_url?: string;
  creator_type: 'user' | 'influencer' | 'celebrity';
  verification_badge?: 'verified' | 'gold' | 'diamond' | null;
  social_links?: SocialLinks;
  total_lookbooks: number;
  total_likes: number;
  total_views: number;
  follower_count?: number;
  joined_date: string;
}
