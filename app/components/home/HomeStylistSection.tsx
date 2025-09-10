"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const HomeStylistSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/50 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-gray-900/5 border border-gray-200/60 p-8 md:p-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div
            className="absolute -top-6 left-1/2 transform -translate-x-1/2"
            variants={itemVariants}
          >
            <div className="bg-white px-8 py-3 rounded-full shadow-lg border border-gray-200/60">
              <h2 className="text-center font-light text-xl md:text-2xl tracking-widest text-gray-900 whitespace-nowrap">
                STYLIST SAYS
              </h2>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-12 pt-8">
            {/* Text Content */}
            <motion.div
              className="flex-1 space-y-6"
              variants={itemVariants}
            >
              <motion.p
                className="text-lg md:text-xl leading-relaxed text-gray-700 max-w-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                Your style shouldn't be left to trends, tabs, or trial and error.
                <br />
                <br />
                At MyMirro, every look blends your quiz inputs with AI precision and
                stylist expertise.
                <br />
                <br />
                We don't just match clothes, we decode your preferences,
                proportions, and personality to build a wardrobe that knows you
                better than you know yourself.
                <br />
                <br />
                <span className="font-medium text-gray-900">
                  Styling, redefined. Personal. Intentional. Built around you.
                </span>
              </motion.p>
            </motion.div>

            {/* Process Icons */}
            <motion.div
              className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12"
              variants={containerVariants}
            >
              {/* Quiz */}
              <motion.div
                className="flex flex-col items-center space-y-4 group"
                variants={iconVariants}
                whileHover="hover"
              >
                <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src="/assets/quiz.svg"
                    alt="Quiz"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <span className="font-medium text-gray-900 text-sm tracking-wide">
                  QUIZ
                </span>
              </motion.div>

              {/* Arrow */}
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-8 h-px bg-gradient-to-r from-gray-300 to-gray-400"></div>
              </motion.div>

              {/* AI */}
              <motion.div
                className="flex flex-col items-center space-y-4 group"
                variants={iconVariants}
                whileHover="hover"
              >
                <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src="/assets/ai.svg"
                    alt="AI"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <span className="font-medium text-gray-900 text-sm tracking-wide">
                  AI
                </span>
              </motion.div>

              {/* Arrow */}
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="w-8 h-px bg-gradient-to-r from-gray-300 to-gray-400"></div>
              </motion.div>

              {/* Stylist */}
              <motion.div
                className="flex flex-col items-center space-y-4 group"
                variants={iconVariants}
                whileHover="hover"
              >
                <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src="/assets/stylist.svg"
                    alt="Stylist"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <span className="font-medium text-gray-900 text-sm tracking-wide">
                  STYLIST
                </span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeStylistSection; 