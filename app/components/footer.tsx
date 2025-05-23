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
  const [user, setUser] = useState({
    email: "",
  });
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row justify-between gap-10">
        {/* Brand + Newsletter */}
        <div className="flex flex-col flex-1 space-y-4">
          <Image
            src="/assets/logoAtFooter.svg"
            alt="logo"
            width={130}
            height={60}
          />
        </div>

        {/* About */}
        <div className="flex-1">
          <h1 className="font-[Boston] text-[25px] leading-[100%] tracking-[0] mb-2">
            About Us
          </h1>
          <p className="text-sm font-[Boston] text-[14px] not-italic font-normal leading-normal">
            Helping you discover your style, effortlessly and personally.
          </p>
        </div>

        {/* Contact */}
        <div className="flex-1 space-y-4">
          <h1 className="font-[Boston] text-[25px] leading-[100%] tracking-[0] mb-5">
            Contact Us
          </h1>
          <p className="flex items-center gap-4 text-sm font-[Boston] text-[14px] not-italic font-semibold leading-normal">
            <MdCall /> 9560661809
          </p>
          <p className="flex items-center gap-4 text-sm font-[Boston] text-[14px] not-italic font-semibold leading-normal">
            <IoMdMail /> info@mymirro.in
          </p>
        </div>

        {/* Information */}
        <div className="flex-1">
          <h1 className="font-[Boston] text-[25px] leading-[100%] tracking-[0] mb-2">
            Information
          </h1>
          <ul className="space-y-1 text-sm">
            <li className="font-[Boston] text-[14px] not-italic font-normal leading-normal">
              About
            </li>
            <li className="font-[Boston] text-[14px] not-italic font-normal leading-normal">
              More Search
            </li>
            <li className="font-[Boston] text-[14px] not-italic font-normal leading-normal">
              Blog
            </li>
            <li className="font-[Boston] text-[14px] not-italic font-normal leading-normal">
              Testimonials
            </li>
          </ul>
        </div>

        {/* Helpful Links */}
        <div className="flex-1">
          <h1 className="mb-2 font-[Boston] text-[25px] leading-[100%] tracking-[0]">
            Helpful Links
          </h1>
          <ul className="space-y-1 text-sm">
            <li className="font-[Boston] text-[14px] not-italic font-normal leading-normal">
              Services
            </li>
            <li className="font-[Boston] text-[14px] not-italic font-normal leading-normal">
              Support
            </li>
            <li className="font-[Boston] text-[14px] not-italic font-normal leading-normal">
              Terms & Conditions
            </li>
          </ul>
        </div>
      </div>

      {/*NewsLetter */}
      <div className="space-y-4 flex flex-col mt-6 px-4">
        <label className="text-sm  mt-4  font-[Boston] text-[25px] leading-[100%] tracking-[0]">
          Newsletter
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          className="wfull px-4 py-2 text-black bg-white border border-gray-300 rounded"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <button className="bg-gray-800 text-white py-1 px-2 h-8 w-1/2 font-[Boston] text-[12px] not-italic font-normal leading-normal  hover:bg-gray-300 transition">
          Join our newsletter
        </button>
      </div>

      {/* Horizontal line */}
      <hr className="w-full border-t border-white my-6 mt-8" />

      {/* Social Icons */}
      <div className="flex justify-center space-x-2 text-white text-2xl mb-4">
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
      <div className="text-center text-sm text-white flex justify-center items-center mt-10 gap-2">
        <DiCreativecommons />
        <span>2025. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
