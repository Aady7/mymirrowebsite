

import TestimonialSection from "@/app/components/testimonialSection";
import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

const page = async () => {
  // Create a Supabase client in your server component
  const supabase = createServerComponentClient({ cookies });

  // Get the session from Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
     
      <div>
        <div className="relative overflow-hidden">
          {" "}
          {/* This wrapper handles edge cases */}
          <section
            className="container-section container mx-auto relative h-screen w-[100vw] left-[calc(-50vw+50%)] flex items-center justify-center bg-cover bg-fixed bg-center"
            style={{
              backgroundImage:
                "url('https://www.instyle.com/thmb/mBCPAq2-Xjj2aPdIkv36nQd0-6Y=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/052623-style-tips-lead-051015daa6224e0b834cf55b2082f158.jpg')",
            }}
          >
            {/* Dimmed Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 w-full">
              {/* Lines and Heading */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-1/4 border-t-4 border-white mb-5"></div>
                <h1 className="text-3xl md:text-6xl font-bold text-white px-4 pt-10 pb-10 text-center">
                  No more <i>styling  </i> hassle
                </h1>
                <div className="w-1/4 border-t-4 border-white mt-4 pt-5"></div>
              </div>

              <p className="text-lg md:text-xl mb-6 max-w-2xl mt-10 mx-auto line-clamp-3">
                Personalised outfits, curated just for you.
                <br /> Share your style and we will find the
                <br /> perfect look!
              </p>
              <Link href="/style-quiz">
                <Button className="px-6 py-3 bg-pink-300 text-black font-semibold rounded-md">
                  Take your style quiz now!
                </Button>
              </Link>
            </div>
          </section>
        </div>

        <section className="py-16 bg-white w-full">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12"></h2>

            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center mb-12 gap-12 md:gap-15">
              {/* Image Column - Taller and Narrower */}
              <div className="md:w-2/5">
                {" "}
                {/* Reduced width from 1/2 to 2/5 */}
                <img
                  src="https://jdinstitute.ac.in/wp-content/uploads/2021/01/105-why-is-fashion-styling-important.jpeg"
                  alt="Feature 1"
                  className="w-full h-[400px] md:h-[500px] object-cover rounded-lg"
                />
                {/* Increased height */}
              </div>

              {/* Text Column - With More Spacing */}
              <div className="md:w-3/5 md:pl-15 mt-3 md:mt-0 space-y-6">
                {" "}
                {/* Increased gap */}
                <h3 className="text-2xl md:text-6xl font-semibold text-black font-['Boston']">
                  {" "}
                  {/* Boston style */}
                  Fashion Made Effortless
                </h3>
                <p className="text-black font-semibold text-lg">
                  MyMirro delivers handpicked looks, curated just for you
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row items-center mb-12 gap-12">
              {/* Text Column - Now on Left Side */}
              <div className="md:w-3/5 md:pr-12 mt-3 md:mt-0 space-y-6">
                <h3 className="text-2xl md:text-6xl font-semibold text-black">
                  Too many choices, yet nothing to wear?
                </h3>
                <p className="text-black font-semibold text-lg">
                  We simplify style.
                  <br />
                  Get personalized outfits without the stress.
                </p>
              </div>

              {/* Image Column - Now on Right Side */}
              <div className="md:w-2/5">
                <img
                  src="https://jdinstitute.ac.in/wp-content/uploads/2021/01/105-why-is-fashion-styling-important.jpeg"
                  alt="Feature 1"
                  className="w-full h-[400px] md:h-[500px] object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row items-center mb-12 gap-12 md:gap-15">
              {/* Image Column - Taller and Narrower */}
              <div className="md:w-2/5">
                {" "}
                {/* Reduced width from 1/2 to 2/5 */}
                <img
                  src="https://jdinstitute.ac.in/wp-content/uploads/2021/01/105-why-is-fashion-styling-important.jpeg"
                  alt="Feature 1"
                  className="w-full h-[400px] md:h-[500px] object-cover rounded-lg"
                />
                {/* Increased height */}
              </div>

              {/* Text Column - With More Spacing */}
              <div className="md:w-3/5 md:pl-15 mt-3 md:mt-0 space-y-6">
                {" "}
                {/* Increased gap */}
                <h3 className="text-2xl md:text-6xl font-semibold text-black font-['Boston']">
                  {" "}
                  {/* Boston style */}
                  Not sure whats trending or what suits you?
                </h3>
                <p className="text-black font-semibold text-lg">
                  Our fashion experts handpick styles tailored to you.
                </p>
              </div>
            </div>
            <div className="max-w-10xl mx-auto px-4 flex justify-center">
              <Link href="/style-quiz">
                <Button className="flex items-center justify-center bg-pink-300 text-black font-semibold rounded-md px-4 py-2">
                  Take your style quiz now!
                </Button>
              </Link>
            </div>

            {/* Feature 4: Fashion Finds */}
            <div className="px-4 py-10 md:px-12 lg:px-20 bg-white max-w-7xl mx-auto rounded-lg">
              <h1 className="font-bold text-3xl md:text-4xl text-center mb-8">
                Fashion Finds
              </h1>

              <div className="flex flex-col md:flex-row gap-6 md:h-[500px]">
                {/* Left Column: Single Image */}
                <div className="md:w-1/2 relative h-[300px] md:h-full rounded-2xl overflow-hidden">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4v44-u05Ts01tFkTZhKaKDnkYlzQ8EvnKdA&s"
                    alt="Left Feature"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                      Outfit Ideas
                    </h3>
                    <p className="text-sm md:text-base max-w-sm">
                      Discover stylish outfits tailored to your taste.
                    </p>
                  </div>
                </div>

                {/* Right Column: Two stacked images */}
                <div className="md:w-1/2 flex flex-col gap-6">
                  {/* Top Right Image */}
                  <div className="flex-1 relative rounded-2xl overflow-hidden">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDHQXeOYPozPPadEPqkwKZPU8jma8773qutw&s"
                      alt="Top Right"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        Quality Styles
                      </h3>
                      <p className="text-sm md:text-base max-w-sm">
                        Shop with confidence and style today.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Right Image */}
                  <div className="flex-1 relative rounded-2xl overflow-hidden">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDHQXeOYPozPPadEPqkwKZPU8jma8773qutw&s"
                      alt="Bottom Right"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        Trendy Accessories
                      </h3>
                      <p className="text-sm md:text-base max-w-sm">
                        Complete your look with perfect accessories.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Assuming TestimonialSection is already responsive */}
        <TestimonialSection />
      </div>
    </>
  );
};

export default page;
