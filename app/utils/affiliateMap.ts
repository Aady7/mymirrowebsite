//my links are here current we will dealing with the myntra link
export const affiliateMap = {
  myntra: "https://www.myntra.com",
  ajio: "https://www.ajio.com",
  amazon: "https://www.amazon.in",
};

//function to get the final url and just redirect it the the product url
export const getAffiliate = (url: string, affiliatesource: string): string => {
  if (!affiliatesource || typeof affiliatesource !== "string") return url;

  const key = affiliatesource.toLowerCase();
  if (!(key in affiliateMap))
    {
        console.warn(`Affiliate mapping missing for: ${key}`);
        return url;
    }  

  // For now just return the original product links
  return url;
};
