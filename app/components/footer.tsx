"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { DiCreativecommons } from "react-icons/di";
import { FaFacebook } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdCall } from "react-icons/md";

const Footer = () => {
  const [user, setUser] = useState({ email: "" });

  return (
    <footer className="bg-black text-white py-10 pb-2 ">
      <div className="max-w-10xl mx-auto px-6 sm:px-4 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-[10rem] gap-10 mb-10">
          {/* Left Column: Logo + Contact */}
          <div className="flex flex-col gap-6 lg:gap-25 lg:max-w-[400px]">
            {/* Logo + Paragraph */}
            <div className="max-w-full lg:max-w-[300px]">
              <div className="mb-8">
                <Image
                  src="/assets/logoAtFooter.svg"
                  alt="logo"
                  width={200}
                  height={100}
                />
              </div>
              <p className="text-sm text-[14px] not-italic font-light leading-normal">
                Helping you discover your style, effortlessly<br /> and personally.
              </p>
            </div>

            {/* Contact */}
            <div className="max-w-full lg:max-w-[200px] mt-5">
              <h1 className="text-[20px] sm:text-[25px] leading-[100%] tracking-[1] mb-5">
                Contact Us
              </h1>
              <p className="flex items-center gap-4 text-sm font-[Boston] tracking-wide text-[14px] not-italic font-light leading-normal">
                <MdCall className="text-xl" /> 9560661809
              </p>
              <p className="flex items-center mt-4 gap-4 text-sm font-[Boston] text-[14px] not-italic font-light tracking-wide leading-normal">
                <IoMdMail className="text-xl" /> info@mymirro.in
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col lg:flex-row lg:gap-[10rem] gap-10 flex-1 mt-10 lg:mt-[4rem]">
            {/* Information */}
            <div className="flex-1 max-w-full lg:max-w-[200px] mb-6 lg:mb-0">
              <h1 className="text-[20px] sm:text-[25px] leading-[100%] tracking-[1] mb-4">
                Information
              </h1>
              <ul className="space-y-3 text-sm">
                <Link href="/aboutpage">
                  <li className="mb-2 text-[14px] not-italic font-light leading-normal hover:underline">
                    About Us
                  </li>
                </Link>
                <li className="text-[14px] not-italic font-light leading-normal hover:underline">
                  More Search
                </li>
                <li className="text-[14px] not-italic font-light leading-normal hover:underline">
                  Blog
                </li>
                <li className="text-[14px] not-italic font-light leading-normal hover:underline">
                  Testimonials
                </li>
              </ul>
            </div>

            {/* Helpful Links */}
            <div className="flex-1 max-w-full lg:max-w-[200px] mb-6 lg:mb-0">
              <h1 className="text-[20px] sm:text-[25px] leading-[100%] tracking-[1] mb-4">
                Helpful Links
              </h1>
              <ul className="space-y-3 text-sm">
                <li className="font-[Boston] text-[14px] not-italic font-normal leading-normal hover:underline">
                  Services
                </li>
                <li className="font-[Boston] text-[14px] not-italic font-normal leading-normal hover:underline">
                  Support
                </li>
                <li className="font-[Boston] text-[14px] not-italic font-normal leading-normal hover:underline">
                  Terms & Conditions
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="flex-1 max-w-full lg:max-w-[300px]">
              <h1 className="text-[20px] sm:text-[25px] leading-[100%] tracking-[0] mb-4">
                Newsletter
              </h1>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="w-[80%] px-4 py-2 text-black bg-white border border-gray-300 mb-3"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
              <button className="bg-[#212121] text-white py-2 px-4 w-fit sm:w-auto text-[12px] tracking-[1]   hover:bg-gray-300 transition">
                Join our newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal line */}
        <hr className="w-[95%] border-t border-white mt-5 my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center">
          {/* Social Icons */}
          <div className="flex justify-center space-x-4 text-white text-2xl mb-4">
            <Link
              href="https://www.facebook.com/profile.php?id=61573340280599"
              target="_blank"
            >
              <FaFacebook className="hover:text-gray-400 cursor-pointer" />
            </Link>
            <Link
              href="https://www.instagram.com/my_mirro_?igsh=cnU0ZzNibWxncXY3"
              target="_blank"
            >
              <BsInstagram className="hover:text-gray-400 cursor-pointer" />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-white flex flex-wrap justify-center items-center gap-2 mt-10 lg:mt-1">
            <DiCreativecommons />
            <span>2025. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;