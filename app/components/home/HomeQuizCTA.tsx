import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomeQuizCTA = () => (
  <>
    {/* Quiz Button - Mobile Only */}
    <div className="flex md:hidden justify-center w-full mb-8">
      <Link href="/style-quiz-new">
        <Button className="px-6 py-3 h-14 w-50 bg-[#007e90] hover:bg-[#006d7d] text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105">
          Take your style quiz now!
        </Button>
      </Link>
    </div>
    {/* Quiz Button - Desktop Only */}
    <div className="hidden md:flex justify-center mb-12">
      <Link href="/style-quiz-new">
        <Button className="px-6 py-3 h-14 w-50 bg-[#007e90] hover:bg-[#006d7d] text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105">
          Take your style quiz now!
        </Button>
      </Link>
    </div>
  </>
);

export default HomeQuizCTA; 