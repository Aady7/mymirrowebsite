"use client";
import React, { useState, useEffect } from "react";
import LoaderOne from "./loaderOne";
import LoaderTwo from "./loaderTwo";
import LoaderThree from "./loaderThree";
import LoaderFour from "./loaderFour";
import LoaderFive from "./loaderFive";

const SmartLoader = () => {
  const [selectedLoader, setSelectedLoader] = useState(0);

  useEffect(() => {
    // Randomly select one of the 5 loaders when component mounts
    const randomIndex = Math.floor(Math.random() * 5);
    setSelectedLoader(randomIndex);
  }, []);

  const loaders = [
    <LoaderOne key="loader-1" />,
    <LoaderTwo key="loader-2" />,
    <LoaderThree key="loader-3" />,
    <LoaderFour key="loader-4" />,
    <LoaderFive key="loader-5" />
  ];

  return loaders[selectedLoader];
};

export default SmartLoader; 