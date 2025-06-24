"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import FashionTarot from "./fashionTarot";
import Stylist from "./stylist";
import { useEffect, useState } from "react";
import PageLoader from "@/app/components/common/PageLoader";
import { generateOutfit, fetchUserOutfits } from "@/app/utils/outfitsapi";
import { Outfit } from "@/lib/interface/outfit";
import { useAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const StylistSays = () => {
  const { getSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { session } = await getSession();
        if (!session?.user?.id) {
          throw new Error("No session found");
        }

        // Fetch user ID from users_updated table
        const { data: userData, error: userError } = await supabase
          .from('users_updated')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (userError) throw userError;
        if (!userData?.id) throw new Error("User not found");

        setUserId(userData.id);

        // Generate outfit using the fetched user ID
        const outfit = await generateOutfit(userData.id);
        console.log('Generated outfit:', outfit);

        // Fetch user outfits using the same ID
        const userOutfits = await fetchUserOutfits({ 
          userId: userData.id, 
          limit: 5 
        });
        setOutfits(userOutfits?.outfits || []);

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <PageLoader loadingText="Loading looks..." />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/*Heading section*/}
        <div>
          <div className="flex items-center justify-center mt-4">
            <h1 className="text-black font-[Boston] text-[30px] md:text-[40px] not-italic font-normal leading-normal [font-variant:all-small-caps] text-center">
              STYLIST SAYS
            </h1>
          </div>
        </div>

        {/*Stylist section*/}
        <Stylist />

        {/*fashion taro card */}
        <FashionTarot />

        {/*curated looks just for you*/}
        <div className="p-2 mt-10 md:p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center space-y-1 md:space-y-3">
            {/* Heading in a fixed width to control centering */}
            <h1 className="text-center font-[Boston] text-[18px] md:text-[25px] not-italic font-normal leading-normal w-[290px] md:w-auto">
              CURATED LOOKS JUST FOR YOU
            </h1>

            {/* Paragraph aligned under "U" by padding-left */}
            <div className="text-center">
              <p className="font-[Boston] text-[13px] md:text-[18px] not-italic font-normal leading-normal max-w-[280px] md:max-w-none mx-auto">
                Handpicked outfit combinations tailored to your unique style profile
              </p>
            </div>
          </div>

          {/* Looks section container */}
          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:mt-12">
            {outfits.map((outfit, index) => (
              <div 
                key={outfit.main_outfit_id}
                className={`${
                  index === 0 ? 'md:col-span-2 lg:col-span-1' : 'md:col-span-1'
                } p-7 flex flex-col`}
              >
                {/* Look header section */}
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-semibold md:text-lg">
                    LOOK {index + 1}
                  </h3>
                  <h3 className="text-sm font-semibold md:hidden">
                    {outfit.outfit_name}
                  </h3>
                </div>

                {/* Images container - Fixed height for all layouts */}
                <div className="h-[400px] flex-grow">
                  <div className="flex gap-2 h-full">
                    {/* Top garment */}
                    <div className="flex-1 h-full relative">
                      <Image
                        src={outfit.top.image}
                        alt={outfit.top.title}
                        fill
                        className="object-cover border-0"
                      />
                    </div>
                    {/* Bottom garment */}
                    <div className="flex-1 h-full relative">
                      <Image
                        src={outfit.bottom.image}
                        alt={outfit.bottom.title}
                        fill
                        className="object-cover border-0"
                      />
                    </div>
                  </div>
                </div>

                {/* View More Button */}
                <div className="flex justify-end mt-2">
                  <Link href={`/looks/${outfit.main_outfit_id}`}>
                    <Button className="bg-black rounded-none w-20 h-6 md:h-8 md:w-25 md:px-6 text-xs">
                      VIEW MORE
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StylistSays;
