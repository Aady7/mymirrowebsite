"use client";
import Link from "next/link";
import { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { DiCreativecommons } from "react-icons/di";
import { FaFacebook } from "react-icons/fa";
const Footer = () => {
  const [user, setEmail] = useState({
    email: "",
  });
  return (
    <footer className="bg-pink-200 text-black py-10">
      <div className="max-w-7xl p-6 mx-auto flex flex-col lg:flex-row justify-between gap-10">
        {/* Brand name */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">My Mirro</h1>
          <p className="mb-4 mt-4">Effortless fashion, curated just for you.</p>
          <div className="flex space-x-4 text-3xl mt-15 ">
            {/*attached the mymirro fb and instagram link*/}
           <Link href='https://www.facebook.com/profile.php?id=61573340280599'>
           <FaFacebook className="cursor-pointer hover:text-gray-800 " />
           </Link> 
           <Link href='https://www.instagram.com/my_mirro_?igsh=cnU0ZzNibWxncXY3'>
           <BsInstagram className="cursor-pointer hover:text-gray-800" />
           </Link> 
          </div>
        </div>

        {/* Contact Info of mimirro*/}
        <div className="flex-1">
          <h6 className="text-xl font-semibold mb-2">QUALITY</h6>
          <p className="mb-1">info@mymirro.in</p>
          <span>+91 7800291779</span>
        </div>

        {/* Newsletter */}
        <div className="flex-1 space-y-9">
          <h1 className="text-xl font-semibold mb-2">TRENDS</h1>
          <label className="block mb-1 mt-6">Enter your email address</label>
          <input
            type="email"
            name="email"
            placeholder="Your email for updates"
            className="w-full px-4 py-2 mb-2 bg-white border border-gray-300 rounded-xl"
            value={user.email}
            onChange={(e) => setEmail({ ...user, email: e.target.value })}
            required
          />
          <button className="w-60 mt-4 bg-black text-white py-2 rounded-2xl hover:bg-gray-800 transition duration-200">
            Join our newsletter
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-sm lg:pl-25">
        <p className="flex items-center gap-1 justify-center lg:justify-start">
          <DiCreativecommons /> 2025. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
