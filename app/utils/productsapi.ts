export const getSimilarProducts = async ({
    productId,
    count = 10,
    diverse = true,
    personalized = false,
  }: {
    productId: string | number;
    count?: number;
    diverse?: boolean;
    personalized?: boolean;
  }) => {
    const query = new URLSearchParams({
      id: String(productId),
      count: String(count),
      diverse: String(diverse),
      personalized: String(personalized),
    });
  
    const res = await fetch(`/api/mymirrobackend/get-similar-products?${query.toString()}`, {
      method: 'GET',
    });
  
    if (!res.ok) {
      throw new Error('Failed to fetch similar products');
    }
  
    return await res.json();
  };
  