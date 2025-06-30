import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');
    const count = searchParams.get('count');
    const diverse = searchParams.get('diverse') ?? 'true';
    const personalized = searchParams.get('personalized') ?? 'false';

    if (!productId) {
        return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const backendUrl = `https://backend.mymirro.in/api/v1/products/${productId}/similar?count=${count || 10}&diverse=${diverse}&personalized=${personalized}`;

    // Prepare the payload exactly as shown in Swagger example that worked
    const payload = {
        count: 8,
        diverse: true,
        personalized: false
    };

    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        
        // If API returns success but with null product data, fetch from Supabase
        if (response.status === 200 && data.success && data.similar_products) {
            try {
                // Fetch similar product IDs from similar_products table
                const { data: similarProductsData, error: similarError } = await supabase
                    .from('similar_products')
                    .select('similar_product_id')
                    .eq('main_product_id', productId)
                    .limit(8);

                if (similarError) {
                    return NextResponse.json(data, { status: response.status });
                }

                if (similarProductsData && similarProductsData.length > 0) {
                    const similarProductIds = similarProductsData.map(item => item.similar_product_id);

                    // Map similar_product_ids to actual product_ids through tagged_product table
                    const { data: taggedProductsData, error: taggedError } = await supabase
                        .from('tagged_products')
                        .select('id, product_id')
                        .in('id', similarProductIds);

                    if (taggedError) {
                        console.log('[ROUTE] Error fetching tagged products:', taggedError);
                        return NextResponse.json(data, { status: response.status });
                    }

                    if (taggedProductsData && taggedProductsData.length > 0) {
                        const actualProductIds = taggedProductsData.map(item => item.product_id);

                        // Fetch full product details using actual product IDs
                        const { data: productsData, error: productsError } = await supabase
                            .from('products')
                            .select('id, title, name, price, productImages')
                            .in('id', actualProductIds);

                        if (productsError) {
                            return NextResponse.json(data, { status: response.status });
                        }

                        if (productsData && productsData.length > 0) {
                            
                            // Combine similarity scores from API with product details from Supabase
                            const enrichedSimilarProducts = data.similar_products.map((apiProduct: any, index: number) => {
                                const productDetail = productsData[index]; // Match by index for now
                                
                                if (productDetail) {
                                    // Parse product images
                                    let imageUrl = '/fallback.jpg';
                                    try {
                                        const images = JSON.parse(productDetail.productImages);
                                        imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : '/fallback.jpg';
                                    } catch {
                                        imageUrl = '/fallback.jpg';
                                    }

                                    return {
                                        ...apiProduct,
                                        product_id: productDetail.id.toString(),
                                        title: productDetail.title || productDetail.name,
                                        image_url: imageUrl,
                                        price: productDetail.price,
                                    };
                                }
                                return apiProduct;
                            });

                            // Return the enriched data
                            const enrichedData = {
                                ...data,
                                similar_products: enrichedSimilarProducts
                            };
                            
                            return NextResponse.json(enrichedData, { status: response.status });
                        }
                    }
                }
            } catch (supabaseError) {
                // Fall back to returning the original API data
            }
        }
        
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

