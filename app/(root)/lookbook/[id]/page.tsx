"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LookBookCard from "@/app/components/look-book/lookBooklookCard";
import LookBookOutfit from "@/app/components/look-book/lookBookOutfit";
import LookBookProduct from "@/app/components/look-book/lookBookProduct";
import { looksData } from "@/app/utils/lookData";

interface LookbookData {
  id: string;
  name: string;
  characterImage: string;
  backgroundColor: string;
  avatarSticker: string;
  outfits: OutfitData[];
  products: ProductData[];
}

interface OutfitData {
  id: string;
  name: string;
  leftImage: string;
  rightImage: string;
}

interface ProductData {
  id: string;
  name: string;
  image: string;
  url: string;
}

const LookbookPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [lookbookData, setLookbookData] = useState<LookbookData | null>(null);
  const [loading, setLoading] = useState(true);

  // Dummy data for fallback
  const dummyLookbookData: LookbookData = {
    id: id as string,
    name: "My Signature Style",
    characterImage: "/assets/stickers/image_1.svg",
    backgroundColor: "#B58CD2",
    avatarSticker: "/assets/stickers/image_1.svg",
    outfits: [
      {
        id: "outfit-1",
        name: "URBAN SHIFT",
        leftImage: "/assets/pant-22.png",
        rightImage: "/assets/tex-2.png"
      },
    
      {
        id: "outfit-2", 
        name: "STREET STYLE",
        leftImage: "/assets/shooes.png",
        rightImage: "/assets/pant-22.png"
      },
    ],
    products: [
      {
        id: "product-1",
        name: "Glitchez Vivid Edge Shirt",
        image: "/assets/tex-2.png",
        url: "/products/1"
      },
      {
        id: "product-2", 
        name: "Kook N Keech Trousers",
        image: "/assets/pant-22.png",
        url: "/products/2"
      },
      {
        id: "product-3",
        name: "Adidas Samba OG",
        image: "/assets/shooes.png", 
        url: "/products/3"
      },
    
    ]
  };

  useEffect(() => {
    // Simulate API call to fetch lookbook data
    const fetchLookbookData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/lookbook/${id}`);
        // const data = await response.json();
        
        // For now, use dummy data after a short delay to simulate loading
        setTimeout(() => {
          setLookbookData(dummyLookbookData);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Error fetching lookbook data:", error);
        // Fallback to dummy data on error
        setLookbookData(dummyLookbookData);
        setLoading(false);
      }
    };

    if (id) {
      fetchLookbookData();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/lookbook/${id}/edit`);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this lookbook?")) {
      // In a real app, you would call your delete API
      console.log("Deleting lookbook:", id);
      router.push("/lookbook");
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/lookbook/${id}`;
    if (navigator.share) {
      navigator.share({
        title: lookbookData?.name || "My Lookbook",
        url: shareUrl,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert("Share link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your lookbook...</p>
        </div>
      </div>
    );
  }

  if (!lookbookData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Lookbook not found</h2>
          <p className="text-gray-600 mb-4">The lookbook you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push("/lookbook")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Back to Lookbooks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
       

        {/* Main LookBook Card */}
        <div className="mb-12 flex justify-center">
          <div className="w-full max-w-sm">
            <LookBookCard
              imageUrl={lookbookData.characterImage}
              heading={lookbookData.name}
              backgroundColor={lookbookData.backgroundColor}
              avatarSticker={lookbookData.avatarSticker}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          </div>
        </div>

        {/* Outfits Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6  mx-auto px-4"> OUTFITS</h2>
          {lookbookData.outfits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lookbookData.outfits.map((outfit) => (
                <LookBookOutfit
                  key={outfit.id}
                  leftImageUrl={outfit.leftImage}
                  rightImageUrl={outfit.rightImage}
                  outfitName={outfit.name}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👗</div>
              <p className="text-gray-600 text-lg">No outfits added yet</p>
              <p className="text-gray-500">Start adding outfits to build your lookbook!</p>
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 mx-auto px-4">PRODUCTS</h2>
          {lookbookData.products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {lookbookData.products.map((product) => (
                <LookBookProduct
                  key={product.id}
                  productImageUrl={product.image}
                  productUrl={product.url}
                  productId={product.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛍️</div>
              <p className="text-gray-600 text-lg">No products added yet</p>
              <p className="text-gray-500">Add products to showcase your style preferences!</p>
            </div>
          )}
        </div>

      
        {/* Back Navigation */}
        <div className="text-center">
          <button
            onClick={() => router.push("/lookbook")}
            className="text-purple-600 hover:text-purple-700 font-medium underline"
          >
            ← Back to All Lookbooks
          </button>
        </div>
      </div>
    </div>
  );
};

export default LookbookPage;