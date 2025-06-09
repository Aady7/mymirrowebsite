"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import CheckoutTracker from "./tracker";

const Address = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [itemCount, setItemCount] = useState(1); // make this dynamic if needed
  return (
    <>
      {/* header section */}
      <div className="w-full px-[24px] md:px-6 lg:px-8 py-4 mt- 0">
        <h1 className="text-black text-[25px] font-semibold font-[Boston] [font-variant:all-small-caps] leading-none">
          ADD NEW ADDRESS
        </h1>
      </div>

      {/*tracker */}
      <CheckoutTracker  currentStep={currentStep}  />

      {/*Contact details */}
      <div className="w-full max-w-sm px-[24px] md:px-6 lg:px-8 py-4">
        <div className="grid w-full gap-3">
          <label className="text-black text-[20px] font-medium tracking-wide [font-variant:all-small-caps]">
            CONTACT DETAILS
          </label>
          <Input
            type="text"
            id="Name"
            name="name"
            placeholder="Name*"
            className="w-full h-12 rounded-none"
          />
          <Input
            type="number"
            id="number"
            name="mobileNo"
            placeholder="Mobile No*"
            className="w-full h-12 rounded-none"
          />
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="px-[24px] mt-[20px] w-full">
        <hr className="border border-gray-400 w-full" />
      </div>

      {/* address section */}
      <div className="w-full px-[20px] md:px-6 lg:px-8 py-4 mt-4">
        <h1 className="text-black text-[25px] font-semibold font-[Boston] [font-variant:all-small-caps] leading-none">
          ADDRESS
        </h1>
      </div>

      {/*location */}
      <div className="w-full ">
        <div className="flex justify-start">
          <Button className="flex flex-row items-center justify-center gap-2 bg-white text-black  px-6 py-2 rounded-none text-sm">
            <span className="flex items-center">
              <Image
                src="/assets/location.svg"
                alt="location"
                width={16}
                height={16}
                className="object-contain"
              />
            </span>
            <span className="font-semibold">USE MY CURRENT LOCATION</span>
          </Button>
        </div>
      </div>

      <div className="w-full max-w-sm px-[24px] md:px-6 lg:px-8 py-4">
        <div className="grid w-full gap-3">
          <Input
            type="number"
            id="pin"
            name="pincode"
            placeholder="PinCode*"
            className="w-full h-12 rounded-none"
          />
          <Input
            type="text"
            id="address"
            name="address"
            placeholder="Address(House No,Building,Street,Area)*"
            className="w-full h-12 rounded-none"
          />
          <Input
            type="text"
            id="town"
            name=" town"
            placeholder=" Location / Town*"
            className="w-full h-12 rounded-none"
          />
          <Input
            type="text"
            id="city"
            name="city"
            placeholder="City / District*"
            className="w-full h-12 rounded-none"
          />
          <Input
            type="text"
            id="State"
            name="State"
            placeholder=" State*"
            className="w-full h-12 rounded-none"
          />
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="px-[24px] mt-[20px] w-full">
        <hr className="border border-gray-400 w-full" />
      </div>

      {/*address type */}
      <div className="w-full max-w-sm mt-[20px] px-[24px] md:px-6 lg:px-8 py-4">
        <div className="grid w-full gap-3">
          <label className="text-black text-[20px] font-medium tracking-wide [font-variant:all-small-caps]">
            ADDRESS TYPE
          </label>

          {/* Radio Buttons Row */}
          <div className="flex flex-wrap gap-6">
            {/* Home */}
            <div className="flex items-center gap-2">
              <Input
                type="radio"
                id="home"
                name="address"
                className="w-5 h-5"
              />
              <label htmlFor="home" className="text-sm">
                Home
              </label>
            </div>

            {/* Office */}
            <div className="flex items-center gap-2">
              <Input
                type="radio"
                id="office"
                name="address"
                className="w-5 h-5"
              />
              <label htmlFor="office" className="text-sm">
                Office
              </label>
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2 mt-4">
          <Input
            type="checkbox"
            id="default"
            name="default"
            className="w-5 h-5"
          />
          <label htmlFor="default" className="text-sm">
            Make this my default address
          </label>
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="  mt-[20px] w-full">
        <hr className="border border-gray-400 w-full" />
      </div>

      <div className="w-full flex justify-center gap-5 mt-6 mb-3 flex-wrap">
        <Button className="text-black bg-white border-2 border-black px-6 py-2 w-40 rounded-none">
          CANCEL
        </Button>
        <Button  onClick={() => setCurrentStep(2)} className="text-white bg-black border-2 border-black px-6 py-2 w-40 rounded-none">
          SAVE
        </Button>
      </div>
    </>
  );
};

export default Address;
