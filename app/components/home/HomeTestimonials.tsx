"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    rating: 5,
    content:
      "Honestly, MyMirro changed the way I see fashion. Their recommendations were spot on and completely transformed my look. Now, I feel more confident in what I wear!",
    name: "Ritika Verma",
    title: "Fashion Enthusiast",
  },
  {
    id: 2,
    rating: 5,
    content:
      "I used to spend forever scrolling through endless products on other sites, never finding exactly what I wanted. MyMirro made it so easy by showing me exactly what I needed, no more endless browsing!",
    name: "Aanya Gupta",
    title: "Working Professional",
  },
  {
    id: 3,
    rating: 5,
    content:
      "The whole experience with MyMirro was amazing! From the styling advice to the quality of the clothes, everything was spot on. I felt like I had my own personal stylist the whole time!",
    name: "Rohit Mehta",
    title: "Style Seeker",
  },
];

const HomeTestimonials = () => {
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-white/10 border border-white/20 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium text-white tracking-wide">WHAT OUR USERS SAY</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
            Loved by Thousands
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their style with MyMirro
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl text-yellow-400"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    ★
                  </motion.span>
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-white text-lg leading-relaxed mb-6 text-center">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <h4 className="text-white font-medium text-lg">
                  {testimonial.name}
                </h4>
                <p className="text-gray-300 text-sm">
                  {testimonial.title}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-12 mt-16 pt-8 border-t border-white/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">4.9/5</div>
            <div className="text-sm text-gray-300">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">10K+</div>
            <div className="text-sm text-gray-300">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">98%</div>
            <div className="text-sm text-gray-300">Would Recommend</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeTestimonials; 