import similarProductsData from "@/app/utils/similarproductapi.json";
import { supabase } from "../supabase";

interface Product {
  id: number;
  created_at: string;
  url: string;
  title: string;
  name: string;
  overallRating: number;
  price: number;
  mrp: number;
  discount: string;
  sizesAvailable: string;
  productImages: string;
  specifications: string;
  brandName?: string;
}

export const useFetchSimilarProducts = async (productId: number): Promise<Product[]> => {
  try {
    // Find similar product IDs from the JSON data
    const similarProductEntry = similarProductsData.find(entry => entry.productid === productId);
    
    if (!similarProductEntry) {
      return [];
    }

    // Get all similar product IDs
    const similarIds = similarProductEntry.similarproducts;

    // Fetch the actual products from supabase
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .in("id", similarIds);

    if (error) {
      console.error("Error fetching similar products:", error);
      return [];
    }

    return products || [];
  } catch (error) {
    console.error("Error in useFetchSimilarProducts:", error);
    return [];
  }
};