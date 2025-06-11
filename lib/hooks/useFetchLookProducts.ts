import lookapi from "@/app/utils/lookapi.json";
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
}

interface Look {
    lookNumber: number;
    lookName: string;
    lookDescription: string;
    productids: number[];
}

interface LookWithProducts extends Look {
    products: Product[];
}

// Fetch products for a specific look number
export const useFetchLookProducts = async (lookNumber?: number): Promise<LookWithProducts | LookWithProducts[]> => {
    try {
        if (lookNumber) {
            // Find the specific look
            const look = lookapi.find((look) => look.lookNumber === lookNumber);
            if (!look) {
                throw new Error(`Look number ${lookNumber} not found`);
            }

            // Fetch products for this look
            const { data: products, error } = await supabase
                .from("products")
                .select(`
                    id,
                    created_at,
                    url,
                    title,
                    name,
                    overallRating,
                    price,
                    mrp,
                    discount,
                    sizesAvailable,
                    productImages,
                    specifications
                `)
                .in("id", look.productids);

            if (error) {
                throw new Error(`Error fetching products: ${error.message}`);
            }

            return {
                ...look,
                products: products as Product[]
            };
        } else {
            // Fetch all looks with their products
            // Get all product IDs from all looks
            const allProductIds = Array.from(
                new Set(
                    lookapi.flatMap(look => look.productids)
                )
            );

            // Fetch all products in one query
            const { data: allProducts, error } = await supabase
                .from("products")
                .select(`
                    id,
                    created_at,
                    url,
                    title,
                    name,
                    overallRating,
                    price,
                    mrp,
                    discount,
                    sizesAvailable,
                    productImages,
                    specifications
                `)
                .in("id", allProductIds);

            if (error) {
                throw new Error(`Error fetching products: ${error.message}`);
            }

            // Map products to their respective looks
            const looksWithProducts = lookapi.map(look => ({
                ...look,
                products: (allProducts as Product[])?.filter(product => 
                    look.productids.includes(product.id)
                ) || []
            }));

            return looksWithProducts;
        }
    } catch (error) {
        console.error("Error in useFetchLookProducts:", error);
        throw error;
    }
};




;