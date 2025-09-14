"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LookBookCard from "@/app/components/look-book/lookBooklookCard";
import DashboardStyleOutfit from "@/app/components/look-book/DashboardStyleOutfit";
import LookBookProduct from "@/app/components/look-book/lookBookProduct";
import PrivacyToggle from "@/app/components/look-book/PrivacyToggle";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Character } from "@/app/components/lookbook/character";
import { getStickerByName, defaultSticker } from "@/app/data/stickerMapping";

interface LookbookData {
  id: string;
  user_id: string;
  name: string;
  color: string;
  avatar: string;
  visibility: number; // 0 = private, 1 = public
  outfits: string | null; // JSON string of outfit IDs
  products: string | null; // JSON string of product IDs
  shareUrl: string | null;
  created_at: string;
}

interface OutfitData {
  id: string;
  name: string;
  image: string;
  leftImage?: string;
  rightImage?: string;
  topTitle?: string;
  bottomTitle?: string;
  category?: string;
}

interface ProductData {
  id: string;
  name: string;
  image: string;
  brand?: string;
  price?: string;
  affiliateUrl?: string;
}

const LookbookPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { getSession } = useAuth();
  const [lookbookData, setLookbookData] = useState<LookbookData | null>(null);
  const [outfitsData, setOutfitsData] = useState<OutfitData[]>([]);
  const [productsData, setProductsData] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);

  useEffect(() => {
    const fetchLookbookData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user session with multiple methods
        const session = await getSession();
        const { data: { session: directSession } } = await supabase.auth.getSession();
        
        // Try different ways to get user ID
        const currentUserId = session?.session?.user?.id || 
                             session?.user?.id || 
                             directSession?.user?.id;

        // Fetch lookbook data from Supabase
        const { data: lookbook, error: lookbookError } = await supabase
          .from('lookbook')
          .select('*')
          .eq('id', id)
          .single();

        if (lookbookError) {
          throw new Error(lookbookError.message);
        }

        if (!lookbook) {
          setError('Lookbook not found');
          setLoading(false);
          return;
        }

        // Check if lookbook is private and user is not the owner
        if (lookbook.visibility === 0 && lookbook.user_id !== currentUserId) {
          setError('This lookbook is private');
          setLoading(false);
          return;
        }

        
        setLookbookData(lookbook);
        setIsOwner(lookbook.user_id === currentUserId);

        // Fetch outfits data if outfit IDs exist
        if (lookbook.outfits) {
          try {
            const outfitIds = JSON.parse(lookbook.outfits);
            
            if (outfitIds && outfitIds.length > 0) {
              // First fetch outfit data without joins
              const { data: outfitsData, error: outfitsError } = await supabase
                .from('outfits_v2')
                .select('id, category, top_id, bottom_id, rank, gender')
                .in('id', outfitIds);


              if (outfitsError) {
                console.error('Error fetching outfits:', outfitsError);
              } else if (outfitsData && outfitsData.length > 0) {
                
                // Get all unique product IDs from outfits
                const productIds = [...new Set([
                  ...outfitsData.map(outfit => outfit.top_id),
                  ...outfitsData.map(outfit => outfit.bottom_id)
                ].filter(id => id && id !== 0))];

                if (productIds.length > 0) {
                  // Fetch product details
                  const { data: productsData, error: productsError } = await supabase
                    .from('products_v2')
                    .select('id, title, name, price, product_images')
                    .in('id', productIds);

                  if (productsError) {
                    console.error('Error fetching outfit products:', productsError);
                  } else if (productsData) {
                    // Create a map for quick product lookup
                    const productMap = new Map(productsData.map(p => [p.id, p]));
                    
                    // Transform the data to match the expected format
                    const formattedOutfits = outfitsData.map(outfit => {
                      const topProduct = productMap.get(outfit.top_id);
                      const bottomProduct = productMap.get(outfit.bottom_id);
                      
                      // Helper function to extract first image from product_images
                      const getFirstImage = (product: any) => {
                        if (!product?.product_images) return '/assets/logo.png';
                        try {
                          const images = typeof product.product_images === 'string' 
                            ? JSON.parse(product.product_images) 
                            : product.product_images;
                          return Array.isArray(images) && images.length > 0 ? images[0] : '/assets/logo.png';
                        } catch (e) {
                          return '/assets/logo.png';
                        }
                      };
                      
                      const topImage = getFirstImage(topProduct);
                      const bottomImage = getFirstImage(bottomProduct);
                      
                      return {
                        id: outfit.id,
                        name: `${topProduct?.title || topProduct?.name || 'Top'} + ${bottomProduct?.title || bottomProduct?.name || 'Bottom'}`,
                        image: topImage !== '/assets/logo.png' ? topImage : bottomImage,
                        leftImage: topImage,
                        rightImage: bottomImage,
                        topTitle: topProduct?.title || topProduct?.name || 'Top',
                        bottomTitle: bottomProduct?.title || bottomProduct?.name || 'Bottom',
                        category: outfit.category || 'OUTFIT'
                      };
                    });
                    
                    setOutfitsData(formattedOutfits);
                  }
                }
              }
            }
          } catch (e) {
            console.error('Error parsing outfits JSON:', e);
          }
        }

        // Fetch products data if product IDs exist
        if (lookbook.products) {
          try {
            const productIds = JSON.parse(lookbook.products);
            
            if (productIds && productIds.length > 0) {
              const { data: productsData, error: productsError } = await supabase
                .from('products_v2')
                .select('id, title, name, price, product_images, url')
                .in('id', productIds);


              if (productsError) {
                console.error('Error fetching products:', productsError);
              } else if (productsData) {
                
                // Transform the data to match the expected format
                const formattedProducts = productsData.map(product => {
                  let firstImage = '/assets/logo.png';
                  
                  try {
                    if (product.product_images) {
                      const images = typeof product.product_images === 'string' 
                        ? JSON.parse(product.product_images) 
                        : product.product_images;
                      if (Array.isArray(images) && images.length > 0) {
                        firstImage = images[0];
                      }
                    }
                  } catch (e) {
                    console.error('Error parsing product images:', e);
                  }
                  
                  return {
                    id: product.id,
                    name: product.title || product.name || 'Untitled Product',
                    image: firstImage,
                    brand: product.name || '',
                    price: product.price, // Remove rupee symbol here, component will add it
                    affiliateUrl: product.url
                  };
                });
                
                setProductsData(formattedProducts);
              }
            }
          } catch (e) {
            console.error('Error parsing products JSON:', e);
          }
        }

        setLoading(false);
        
      } catch (error: any) {
        console.error("Error fetching lookbook data:", error);
        setError(error.message || 'Failed to load lookbook');
        setLoading(false);
      }
    };

    if (id) {
      fetchLookbookData();
    }
  }, [id, getSession]);

  const handlePrivacyToggle = async (isPublic: boolean) => {
    if (!lookbookData || !isOwner) return;

    try {
      setPrivacyLoading(true);
      
      const { session } = await getSession();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`/api/lookbook/${id}/privacy`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visibility: isPublic ? 1 : 0,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update privacy');
      }

      const result = await response.json();
      
      // Update local state
      setLookbookData(prev => prev ? { ...prev, visibility: result.data.visibility } : null);
      
      // Show success message (you can add a toast notification here)
      console.log(result.data.message);
      
    } catch (error) {
      console.error('Error updating privacy:', error);
      // You can add error toast notification here
    } finally {
      setPrivacyLoading(false);
    }
  };

  const handleEdit = async () => {
    const newName = prompt("Enter new lookbook name:", lookbookData?.name || "");
    if (!newName || !newName.trim() || newName === lookbookData?.name) {
      return;
    }

    try {
      const { session } = await getSession();
      if (!session?.user?.id) {
        alert("You must be logged in to edit a lookbook");
        return;
      }

      const response = await fetch(`/api/lookbook/${id}/name`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName.trim(),
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update lookbook name');
      }

      const result = await response.json();
      
      // Update local state
      setLookbookData(prev => prev ? { ...prev, name: result.data.name } : null);
      
      alert("Lookbook name updated successfully!");
      
    } catch (error) {
      console.error('Error updating lookbook name:', error);
      alert("Failed to update lookbook name. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lookbook? This action cannot be undone.")) {
      return;
    }

    try {
      const { session } = await getSession();
      if (!session?.user?.id) {
        alert("You must be logged in to delete a lookbook");
        return;
      }

      // Delete from Supabase
      const { error } = await supabase
        .from('lookbook')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id); // Ensure user can only delete their own lookbooks

      if (error) {
        throw new Error(error.message);
      }

      alert("Lookbook deleted successfully!");
      router.push("/lookbook");
      
    } catch (error) {
      console.error('Error deleting lookbook:', error);
      alert("Failed to delete lookbook. Please try again.");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/lookbook/${id}`;
    
    try {
      if (navigator.share && navigator.canShare) {
        await navigator.share({
          title: lookbookData?.name || "My Lookbook",
          text: `Check out my lookbook: ${lookbookData?.name || "My Lookbook"}`,
          url: shareUrl,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert("Share link copied to clipboard!");
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Share link copied to clipboard!");
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        alert("Unable to copy link. Please copy manually: " + shareUrl);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your lookbook...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !lookbookData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {error || 'Lookbook not found'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error === 'This lookbook is private' 
              ? 'This lookbook is set to private and you don\'t have access to view it.'
              : 'The lookbook you\'re looking for doesn\'t exist or has been removed.'
            }
          </p>
          <button 
            onClick={() => router.push("/lookbook")}
            className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 tracking-wide"
          >
            Back to Lookbooks
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Privacy Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push("/lookbook")}
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              ← Back to Lookbooks
            </button>
          </div>
          
          {/* Privacy Toggle for Owners */}
          {isOwner && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Privacy Settings</h3>
                  <p className="text-xs text-gray-500">Control who can view this lookbook</p>
                </div>
                <PrivacyToggle
                  isPublic={lookbookData.visibility === 1}
                  onToggle={handlePrivacyToggle}
                  disabled={privacyLoading}
                />
              </div>
            </div>
          )}
          
          {/* Privacy Badge for Non-Owners */}
          {!isOwner && (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                lookbookData.visibility === 1 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {lookbookData.visibility === 1 ? 'Public Lookbook' : 'Private Lookbook'}
              </span>
            </div>
          )}
        </motion.div>

        {/* Main LookBook Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 flex justify-center"
        >
          <div className="w-full max-w-sm">
            <LookBookCard
              imageUrl={Character[0].image} // Use default character image
              heading={lookbookData.name}
              backgroundColor={lookbookData.color}
              avatarSticker={(() => {
                // Handle both cases: sticker name or full path
                if (lookbookData.avatar?.startsWith('/')) {
                  // It's already a path
                  return lookbookData.avatar;
                } else {
                  // It's a sticker name, convert to path
                  return getStickerByName(lookbookData.avatar)?.image || defaultSticker.image;
                }
              })()}
              onEdit={isOwner ? handleEdit : undefined}
              onDelete={isOwner ? handleDelete : undefined}
              onShare={handleShare}
              onView={() => window.location.reload()} // Refresh to show updated content
            />
          </div>
        </motion.div>

        {/* Outfits Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">OUTFITS</h2>
          {outfitsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
              {outfitsData.map((outfit) => (
                <motion.div
                  key={outfit.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <DashboardStyleOutfit
                    leftImageUrl={outfit.leftImage || outfit.image}
                    rightImageUrl={outfit.rightImage || outfit.image}
                    outfitName={outfit.name}
                    topTitle={outfit.topTitle}
                    bottomTitle={outfit.bottomTitle}
                    category={outfit.category}
                    onView={() => {
                      // Navigate to the looks page for this outfit
                      router.push(`/looks/${outfit.id}`);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👗</div>
              <p className="text-gray-600 text-lg">No outfits added yet</p>
              <p className="text-gray-500">Start adding outfits to build your lookbook!</p>
            </div>
          )}
        </motion.div>

        {/* Products Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">PRODUCTS</h2>
          {productsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {productsData.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <LookBookProduct
                    productImageUrl={product.image}
                    productUrl={`/products/${product.id}`}
                    affiliateUrl={product.affiliateUrl}
                    productId={product.id}
                    productName={product.name}
                    productPrice={product.price}
                    productDescription={product.description || "High-quality fashion item perfect for your wardrobe"}
                    productBrand={product.brand || "Fashion Brand"}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛍️</div>
              <p className="text-gray-600 text-lg">No products added yet</p>
              <p className="text-gray-500">Add products to showcase your style preferences!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LookbookPage;