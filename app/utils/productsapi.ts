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
  
    const apiUrl = `/api/mymirrobackend/get-similar-products?${query.toString()}`;
    console.log('🌐 [CLIENT] Calling similar products API:', apiUrl);
    console.log('📝 [CLIENT] Parameters:', { productId, count, diverse, personalized });
  
    const res = await fetch(apiUrl, {
      method: 'GET',
    });
  
    console.log('📊 [CLIENT] API Response Status:', res.status);
  
    if (!res.ok) {
      console.error('❌ [CLIENT] API call failed:', res.status, res.statusText);
      throw new Error('Failed to fetch similar products');
    }
  
    const data = await res.json();
    console.log('✅ [CLIENT] API Response Data:', data);
    return data;
  };
  