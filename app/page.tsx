import HomeHeroSection from "@/app/components/home/HomeHeroSection";
import HomeFeatureSection from "@/app/components/home/HomeFeatureSection";
import HomeQuizCTA from "@/app/components/home/HomeQuizCTA";
import HomeStylistSection from "@/app/components/home/HomeStylistSection";
import HomeTestimonials from "@/app/components/home/HomeTestimonials";

const page = async () => {
  return (
    <>
      <div>
        <HomeHeroSection />
        <HomeFeatureSection />
        <HomeQuizCTA />
        <div className="mb-10">
          <HomeStylistSection />
        </div>
        <HomeTestimonials />
      </div>
    </>
  );
};

export default page;
