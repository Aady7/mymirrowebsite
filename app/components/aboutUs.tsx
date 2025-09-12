"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const AboutUs = () => {
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
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-8 py-16"
      >
        <div className="flex flex-col space-x-6 md:flex-row gap-12 items-start">
          <motion.div 
            className="md:w-1/2 space-y-8"
            variants={itemVariants}
          >
            <motion.h1 
              className="font-bold text-4xl md:text-7xl font-['Boston'] text-gray-900 leading-tight"
              variants={itemVariants}
            >
              Get to know us
            </motion.h1>
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              <p className="font-light text-lg md:text-xl text-gray-700 text-left tracking-wide leading-relaxed">
                I was just trying to buy a pair of shoes, something stylish,
                something that felt like me. But the deeper I went, the more lost I
                felt. Endless tabs. No real guidance. And no idea what would
                actually go with what. By the time I found something I liked, I
                didn't even want it anymore.
              </p>
              
              <p className="font-light text-lg md:text-xl text-gray-700 text-left tracking-wide leading-relaxed">
                So I started asking around. Turns out, I wasn't the only one. People
                told me: <br />
                "I never find anything that fits right." <br />
                "I return half the things I buy." <br />
                "I don't know what actually suits me."
              </p>
              
              <p className="font-light text-lg md:text-xl text-gray-700 text-left tracking-wide leading-relaxed">
                That's when it clicked, it's not the people who are the problem.
                It's the system.
              </p>
              
              <p className="font-light text-lg md:text-xl text-gray-700 text-left tracking-wide leading-relaxed">
                We created MyMirro to change that. MyMirro isn't about transactions.
                It's about transformation, into someone who feels confident,
                stylish, and completely themselves.
              </p>
              
              <p className="font-light text-lg md:text-xl text-gray-700 text-left tracking-wide leading-relaxed">
                We're not just another marketplace. We're your fashion partner.
                And this is just the beginning.
              </p>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="w-full md:w-1/2 flex justify-center"
            variants={imageVariants}
          >
            <motion.div
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/assets/about-1.png"
                alt="About MyMirro"
                className="w-full max-w-[600px] h-[300px] sm:h-[400px] md:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mission & Difference Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white/50 backdrop-blur-sm py-20"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="font-['Boston'] text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Our mission
              </h2>
              <div className="space-y-6">
                <p className="text-lg md:text-xl font-light text-gray-700 leading-relaxed tracking-wide">
                  At MyMirro, we don't just sell clothes, we help you express yourself
                  through fashion. Shopping should be exciting, effortless, and
                  tailored to you. Our goal is to be your personal fashion stylist,
                  ensuring that you always look and feel your best.
                </p>
                <p className="text-lg md:text-xl font-light text-gray-700 leading-relaxed tracking-wide">
                  We understand that online shopping can feel overwhelming, so much
                  choice, yet never quite what you're looking for. That's why we
                  handpick outfits based on your unique preferences, body type, and
                  style. Whether you need guidance, don't have the time, or simply
                  want a better way to shop, we've got you covered.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className="font-['Boston'] text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                What makes us different?
              </h2>
              <div className="space-y-6">
                <p className="text-lg md:text-xl font-light text-gray-700 leading-relaxed tracking-wide">
                  Unlike other platforms, MyMirro isn't just another shopping site. We
                  offer:
                </p>
                <ul className="space-y-4">
                  <motion.li 
                    className="flex items-start space-x-3"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-2 h-2 bg-gray-900 rounded-full mt-3 flex-shrink-0" />
                    <span className="text-lg md:text-xl font-light text-gray-700 leading-relaxed">
                      Personalized fashion advice, real designers helping you
                      style yourself effortlessly.
                    </span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start space-x-3"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-2 h-2 bg-gray-900 rounded-full mt-3 flex-shrink-0" />
                    <span className="text-lg md:text-xl font-light text-gray-700 leading-relaxed">
                      Curated recommendations, you'll only see outfits that truly match your style and personality.
                    </span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start space-x-3"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-2 h-2 bg-gray-900 rounded-full mt-3 flex-shrink-0" />
                    <span className="text-lg md:text-xl font-light text-gray-700 leading-relaxed">
                      Time-saving simplicity, no more endless scrolling, just the
                      best picks for you.
                    </span>
                  </motion.li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Hero Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="relative w-full overflow-hidden"
      >
        <div className="relative w-full h-[400px] sm:h-[600px] md:h-[700px] lg:h-[800px]">
          <Image
            src="/assets/about-2.png"
            alt="MyMirro"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="absolute bottom-8 left-8 right-8 text-white"
          >
            <h3 className="font-['Boston'] text-2xl md:text-4xl font-bold mb-4">
              Fashion that tells your story
            </h3>
            <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl">
              Every outfit is a chapter in your personal style journey. Let us help you write the next one.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-50 to-white py-20"
      >
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-['Boston'] text-4xl md:text-7xl font-bold text-gray-900 mb-8">
              Our Team
            </h2>
            <p className="text-lg md:text-xl font-light text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Our strength lies in our individuality. We're a passionate team of
              three individuals who love fashion, technology, and solving real problems. 
              Our diverse expertise allows us to craft an experience that feels personal, 
              fun, and effortless—just the way shopping should be!
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Founders Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white py-20"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mayank */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center space-y-4 group"
            >
              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/assets/mayanksir.jpg"
                  alt="Mayank"
                  width={300}
                  height={300}
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Mayank</h3>
                <p className="text-gray-600 font-medium">Chief Executive Officer</p>
              </div>
            </motion.div>

            {/* Piyush */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center space-y-4 group"
            >
              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/assets/ppiyush.avif"
                  alt="Piyush Pratap Singh"
                  width={300}
                  height={300}
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Piyush Pratap Singh</h3>
                <p className="text-gray-600 font-medium">Chief Business Officer</p>
              </div>
            </motion.div>

            {/* Akhil */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center space-y-4 group"
            >
              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/assets/akhilBhaiya.avif"
                  alt="Akhil Singh"
                  width={300}
                  height={300}
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Akhil Singh</h3>
                <p className="text-gray-600 font-medium">Chief Technology Officer</p>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
      
    </div>
  );
};

export default AboutUs;
