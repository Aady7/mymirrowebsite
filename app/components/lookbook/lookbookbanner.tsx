"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LookBookBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full px-4 md:px-6 lg:px-8 mt-4 md:mt-6 mb-0"
    >
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl">
        {/* Background Image */}
        <Image
          src="/assets/lookbookbanner.svg"
          alt="LookBook Banner"
          width={1600}
          height={200}
          className="object-cover w-full h-32 md:h-40 lg:h-48"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-between p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white"
          >
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
              Your Style Journey
            </h1>
            <p className="text-sm md:text-base opacity-90">
              Create and manage your personal lookbook
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/lookbook/explore">
              <Button className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 tracking-wide shadow-lg">
                Explore
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LookBookBanner;
