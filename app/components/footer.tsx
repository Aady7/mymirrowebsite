"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { BsInstagram } from "react-icons/bs";
import { DiCreativecommons } from "react-icons/di";
import { FaFacebook } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdCall } from "react-icons/md";

const Footer = () => {
  const [user, setUser] = useState({ email: "" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <motion.div
              className="lg:col-span-1 space-y-6"
              variants={itemVariants}
            >
              <div className="space-y-4">
                <Image
                  src="/assets/logoAtFooter.svg"
                  alt="MyMirro Logo"
                  width={180}
                  height={80}
                  className="filter brightness-0 invert"
                />
                <p className="text-gray-300 text-lg leading-relaxed max-w-sm">
                  Helping you discover your style, effortlessly and personally.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-white text-xl font-light tracking-wide">Contact Us</h3>
                <div className="space-y-3">
                  <motion.div
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <MdCall className="text-xl" />
                    <span className="text-lg">9560661809</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <IoMdMail className="text-xl" />
                    <span className="text-lg">info@mymirro.in</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Information Links */}
            <motion.div
              className="space-y-6"
              variants={itemVariants}
            >
              <h3 className="text-white text-xl font-light tracking-wide">Information</h3>
              <ul className="space-y-4">
                {[
                  { href: "/aboutpage", label: "About Us" },
                  { href: "#", label: "More Search" },
                  { href: "#", label: "Blog" },
                  { href: "#", label: "Testimonials" }
                ].map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-lg"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              className="space-y-6"
              variants={itemVariants}
            >
              <h3 className="text-white text-xl font-light tracking-wide">Helpful Links</h3>
              <ul className="space-y-4">
                {[
                  { href: "#", label: "Services" },
                  { href: "#", label: "Support" },
                  { href: "#", label: "Terms & Conditions" }
                ].map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-lg"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              className="space-y-6"
              variants={itemVariants}
            >
              <h3 className="text-white text-xl font-light tracking-wide">Newsletter</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Stay updated with the latest fashion trends and style tips.
              </p>
              <div className="space-y-4">
                <motion.input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  className="w-full bg-white text-gray-900 py-3 px-6 rounded-xl font-medium tracking-wide hover:bg-gray-100 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join our newsletter
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-12"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          />

          {/* Bottom Section */}
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
            variants={itemVariants}
          >
            {/* Social Icons */}
            <motion.div
              className="flex items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href="https://www.facebook.com/profile.php?id=61573340280599"
                  target="_blank"
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                >
                  <FaFacebook className="text-xl" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href="https://www.instagram.com/my_mirro_?igsh=cnU0ZzNibWxncXY3"
                  target="_blank"
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                >
                  <BsInstagram className="text-xl" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Copyright */}
            <motion.div
              className="flex items-center gap-2 text-gray-400 text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <DiCreativecommons className="text-2xl" />
              <span>2025. All rights reserved.</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;