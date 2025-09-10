import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const HomeQuizCTA = () => (
  <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
    </div>

    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="inline-flex items-center px-6 py-3 bg-white/10 border border-white/20 rounded-full mb-8"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-sm font-medium text-white tracking-wide">DISCOVER YOUR STYLE</span>
        </motion.div>
        
        <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
          Ready to Transform
          <br />
          <span className="italic font-normal text-gray-300">Your Style?</span>
        </h2>
        
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Take our comprehensive style quiz and discover outfits that perfectly match your personality and preferences.
        </p>

        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link href="/style-quiz">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="px-8 py-4 h-16 bg-white text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300 font-medium tracking-wide text-lg shadow-2xl">
                Take Your Style Quiz
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-12 mt-16 pt-8 border-t border-white/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">2 min</div>
            <div className="text-sm text-gray-300">Quick Quiz</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">100%</div>
            <div className="text-sm text-gray-300">Personalized</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">Free</div>
            <div className="text-sm text-gray-300">Forever</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default HomeQuizCTA; 