import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomeHeroSection = () => (
  <section
    className="relative h-[510px] w-screen left-0 flex items-center justify-center bg-cover bg-fixed bg-center md:pt-20 pt-0"
    style={{ backgroundImage: `url('/assets/homelogo.jpg')` }}
  >
    {/* Dimmed Overlay */}
    <div className="absolute inset-0 bg-black opacity-50"></div>
    {/* Content */}
    <div className="relative z-10 text-center text-white px-4 mt-[4rem] w-full">
      <div className="flex flex-col items-center mb-2">
        <div className="w-35 border-t-4 border-white mb-2"></div>
        <h1 className="text-[40px] md:text-6xl font-bold text-white px-4 pt-1 pb-1 text-center tracking-wider leading-tight">
          No more
          <br className="block md:hidden" />
          <i> styling </i>hassle
        </h1>
        <div className="w-40 border-t-4 border-white mt-4 pt-5"></div>
      </div>
      <p className="text-lg md:text-2xl mb-6 max-w-2xl mt-3 mx-auto leading-8 line-clamp-3">
        Personalised outfits, curated just for you.
        <br /> Share your style and we will find the
        <br /> perfect look!
      </p>
      <Link href="/style-quiz-new">
        <Button className="px-6 py-3 h-14 w-45 bg-[#007e90] hover:bg-[#006d7d] text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105">
          Take your style quiz now!
        </Button>
      </Link>
    </div>
  </section>
);

export default HomeHeroSection; 