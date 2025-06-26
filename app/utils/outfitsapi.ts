// All outfit-related API functions go here

export const generateOutfit = async (userId: number) => {
    const res = await fetch('/api/mymirrobackend/create-outfit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
  
    const data = await res.json();
    return data;
  };
  
  export const getOutfitById = async (id: string) => {
  const query = `/api/mymirrobackend/get-outfit?id=${id}`;
  const res = await fetch(query);
  return await res.json();
};

export const getSimilarOutfits = async (id: string, count?: number) => {
  const query = `/api/mymirrobackend/get-similar-outfits?id=${id}${count ? `&count=${count}` : ''}`;
  
  // Add timeout to prevent hanging requests - 5 minutes for long-running API
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout
  
  try {
    console.log('getSimilarOutfits: Making API call to:', query);
    const res = await fetch(query, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('getSimilarOutfits: API response received:', data);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('getSimilarOutfits: API call failed:', error);
    throw error;
  }
};
  
  export const fetchUserOutfits = async ({
    userId,
    limit,
    min_score,
    style,
  }: {
    userId: number;
    limit?: number;
    min_score?: number;
    style?: string;
  }) => {
    const params = new URLSearchParams({ user_id: String(userId) });
    if (limit) params.append('limit', String(limit));
    if (min_score) params.append('min_score', String(min_score));
    if (style) params.append('style', style);
  
    const res = await fetch(`/api/mymirrobackend/get-outfits?${params.toString()}`);
    return await res.json();
  };
  