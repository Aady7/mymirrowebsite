import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    title: "Fashion Made Effortless",
    text: "MyMirro delivers handpicked looks,\ncurated just for you",
    image: "/assets/home1.jpeg",
    imageAlt: "Feature 1",
    textAlign: "left",
  },
  {
    title: "Too many choices, yet nothing to\nwear?",
    text: "We simplify style.\nGet personalized outfits without the stress.",
    image: "/assets/home2.jpeg",
    imageAlt: "Feature 2",
    textAlign: "right",
  },
  {
    title: "Not sure what's trending or what suits you?",
    text: "Our fashion experts handpick styles,\n tailored to you",
    image: "/assets/home3.jpeg",
    imageAlt: "Feature 3",
    textAlign: "left",
  },
];

const HomeFeatureSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gray-900/5 border border-gray-200 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium text-gray-700 tracking-wide">WHY CHOOSE MYMIRRO</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
            Fashion Made Simple
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`flex flex-col lg:flex-row items-center mb-20 gap-12 ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text Column */}
              <motion.div
                className={`lg:w-3/5 space-y-6 ${
                  feature.textAlign === "right"
                    ? "lg:pr-12 flex flex-col items-end text-right"
                    : "lg:pl-12 text-left"
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg shadow-gray-900/5 border border-gray-200/60">
                  <h3 className="text-3xl md:text-5xl font-light text-gray-900 leading-tight mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                    {feature.text}
                  </p>
                </div>
              </motion.div>

              {/* Image Column */}
              <motion.div
                className="w-full lg:w-2/5"
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-gray-900/10">
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt}
                    width={600}
                    height={500}
                    className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HomeFeatureSection; 