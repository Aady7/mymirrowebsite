import Stylist from "@/app/components/recommendations/stylist";
import StylistHome from "@/app/components/stylisthome";
import TestimonialSection from "@/app/components/testimonialSection";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// Create a single supabase client for the entire app
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const page = async () => {
  // Get the session from Supabase
  

  return (
    <>
      <div>
        <div className="relative overflow-hidden">
          {" "}
          {/* This wrapper handles edge cases */}
          <section
            className=" container mx-auto relative h-[510px] w-[100vw] left-[calc(-50vw+50%)] flex items-center justify-center bg-cover bg-fixed bg-center"
            style={{
              backgroundImage: `url('/assets/homelogo.jpg')`,
            }}
          >
            {/* Dimmed Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 mt-[4rem] w-full">
              {/* Lines and Heading */}
              <div className="flex flex-col items-center mb-2">
                <div className="w-35 border-t-4 border-white mb-2"></div>

                <h1 className="text-[40px] md:text-6xl font-bold text-white px-4 pt-1 pb-1 text-center tracking-wider leading-tight">
                  No more
                  <br className="block md:hidden" />
                  <i> styling </i>hassle
                </h1>

                <div className="w-40 border-t-4 border-white mt-4 pt-5"></div>
              </div>

              <p className="text-lg md:text-2xl mb-6 font-thin max-w-2xl mt-3 mx-auto leading-8 line-clamp-3">
                Personalised outfits, curated just for you.
                <br /> Share your style and we will find the
                <br /> perfect look!
              </p>
              <Link href="/style-quiz">
                <Button className="px-6 py-3 h-14 w-45 bg-pink-100 hover:bg-pink-100 text-gray-800 hover:text-gray-700 font-thin rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                  Take your style quiz now!
                </Button>
              </Link>
            </div>
          </section>
        </div>

        <section className="py-14 bg-white w-full p-6">
          <div className="max-w-7xl mx-auto px-2">
            <h2 className="text-3xl font-bold text-center mb-6" aria-label="Features"></h2>

            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center mb-10 gap-8 md:gap-15 px-3">
              {/* Text Column */}
              <div className="md:w-3/5 md:pl-15 mt-2 md:mt-0 space-y-2 text-left">
                <h3 className="text-4xl md:text-6xl font-bold hover:text-gray-700 transition-colors duration-300">
                  Fashion Made Effortless
                </h3>
                <p className="font-light text-sm">
                  MyMirro delivers handpicked looks,
                  <br /> curated just for you
                </p>
              </div>

              {/* Image Column */}
              <div className="w-full md:w-2/5">
                <img
                  src="/assets/home1.jpeg"
                  alt="Feature 1"
                  className="w-[100%] h-[350px] md:h-[500px] object-cover rounded-lg transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row items-center mb-10 gap-10 px-4 ">
              {/* Text Column – Top Right on Mobile */}
              <div className="w-full md:w-3/5 md:pr-12 mt-14 md:mt-0 space-y-4 flex flex-col items-end text-right">
                <h3 className="text-3xl md:text-6xl font-bold text-black hover:text-gray-700 transition-colors duration-300">
                  Too many choices, yet nothing to
                  <br /> wear?
                </h3>
                <p className="font-light text-sm">
                  We simplify style.
                  <br />
                  Get personalized outfits without the stress.
                </p>
              </div>

              {/* Image Column – Below Text on Mobile */}
              <div className="w-full md:w-2/5">
                <img
                  src="/assets/home2.jpeg"
                  alt="Feature 1"
                  className="w-full h-[350px] md:h-[500px] object-cover rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row items-center mb-10 gap-8 md:gap-15 px-3">
              {/* Text Column */}
              <div className="md:w-3/5 md:pl-15 mt-15 md:mt-0 space-y-4 text-left">
                <h3 className="text-4xl md:text-6xl font-bold hover:text-gray-700 transition-colors duration-300">
                  Not sure what's trending or what suits you?
                </h3>
                <p className="font-light text-sm">
                  Our fashion experts handpick styles <br />
                  tailored to you curated just for you
                </p>
              </div>

              {/* Image Column */}
              <div className="w-full md:w-2/5">
                <img
                  src="/assets/home3.jpeg"
                  alt="Feature 1"
                  className="w-[100%] h-[350px] md:h-[500px] object-cover rounded-lg transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Quiz Button - Mobile Only */}
            <div className="flex md:hidden justify-center w-full mb-8">
              <Link href="/style-quiz">

                <Button className="px-6 py-3 h-14 w-50 bg-pink-200 hover:bg-pink-100 text-gray-800 hover:text-gray-700 font-thin rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105">

                  Take your style quiz now!
                </Button>
              </Link>
            </div>
          </div>

          {/* Quiz Button - Desktop Only */}
          <div className="hidden md:flex justify-center mb-12">
            <Link href="/style-quiz">
              <Button className="px-6 py-3 h-14 w-50 bg-pink-200 hover:bg-pink-100 text-gray-800 hover:text-gray-700 font-thin rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                Take your style quiz now!
              </Button>
            </Link>
          </div>


          {/* Stylist section */}

          <StylistHome />

        </section>
        <div className="mt-[-3rem]"> 
        {/* Stylist section */}
          <Stylist/>
          </div>

        {/* Assuming TestimonialSection is already responsive */}
        <TestimonialSection />
      </div>
    </>
  );
};

export default page;
