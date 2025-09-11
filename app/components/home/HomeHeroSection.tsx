import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const HomeHeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const modelVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8 }
    },
    hover: {
      scale: 1.05,
      rotate: 2,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Side - Text Content */}
          <motion.div
            className="space-y-8 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-gray-900/5 border border-gray-200 rounded-full"
              variants={itemVariants}
            >
              <span className="text-xs font-medium text-gray-700 tracking-wide">AI-POWERED FASHION STYLIST</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-5xl md:text-7xl font-light text-gray-900 leading-tight tracking-tight"
              variants={itemVariants}
            >
              No more
              <br />
              <span className="italic font-normal text-gray-600">styling</span> hassle
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Personalised outfits, curated just for you.
              <br />
              Share your style and we will find the perfect look!
            </motion.p>

            {/* CTA Button */}
            <motion.div
              className="flex justify-center lg:justify-start"
              variants={itemVariants}
            >
              <Link href="/style-quiz">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="px-8 py-4 h-14 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-xl transition-all duration-300 font-medium tracking-wide">
                    Take Your Style Quiz
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8 pt-8 justify-center lg:justify-start"
              variants={itemVariants}
            >
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Outfits Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900">95%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Animated Fashion Models */}
          <motion.div
            className="relative h-[600px] flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Model 1 - Main */}
            <motion.div
              className="absolute z-20"
              variants={modelVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-64 h-80"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-2xl overflow-hidden">
                  <Image
                    src="/assets/model-1.png"
                    alt="Fashion Model 1"
                    fill
                    className="object-cover rounded-2xl"
                    priority
                  />
                </div>
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gray-900 rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Model 2 - Background */}
            <motion.div
              className="absolute z-10 top-20 -right-8"
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <motion.div
                className="relative w-48 h-64"
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl shadow-xl overflow-hidden">
                  <Image
                    src="/assets/model-2.png"
                    alt="Fashion Model 2"
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Model 3 - Background */}
            <motion.div
              className="absolute z-10 bottom-20 -left-8"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <motion.div
                className="relative w-40 h-56"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl shadow-lg overflow-hidden">
                  <Image
                    src="/assets/model-3.png"
                    alt="Fashion Model 3"
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Fashion Icons */}
            <motion.div
              className="absolute top-10 left-10 text-2xl"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>

            <motion.div
              className="absolute bottom-10 right-10 text-2xl"
              animate={{
                y: [0, 20, 0],
                rotate: [0, -360, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              👠
            </motion.div>

            <motion.div
              className="absolute top-1/2 right-5 text-xl"
              animate={{
                x: [0, 20, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              💎
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default HomeHeroSection;