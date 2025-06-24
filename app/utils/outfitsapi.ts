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
  
  export const getSimilarOutfits = async (id: string, count?: number) => {
    const query = `/api/mymirrobackend/get-similar-outfits?id=${id}${count ? `&count=${count}` : ''}`;
    const res = await fetch(query);
    return await res.json();
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
  