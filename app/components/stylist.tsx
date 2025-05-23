import Image from "next/image";

const Stylist = () => {
  return (
    <div className="px-4 w-full max-w-[480px] mx-auto">
    

      {/*stylist section*/}
      <div className="p-4 ">
        <div className="  p-0">
          {/* Text + Image */}
          <div className="flex flex-col items-center justify-between">
            <p className="  font-[Boston] text-[12px] not-italic font-normal leading-normal">
              <span className="font-semibold">Ahan</span>, your style journey
              starts with your
              <span className="font-semibold"> quiz</span> answers,layered
              <br/>with <span className="font-semibold">AI </span>
              insights and<span className="font-semibold">stylist </span>
              expertise — all working together to{" "}
              <span className="flex items-center justify-center">
                tailor every look just for you.
              </span>
            </p>

            <div className="flex flex-row items-center overflow-x-auto mt-6 px-4 gap-0  ">
              <div className="flex flex-col items-center w-[90px]">
                <Image
                  src="/assets/quiz.png"
                  alt="quiz photo"
                  width={80}
                  height={70}
                  className="object-contain shrink-0"
                />
                <span className="font-light text-black text-[10px] text-center">
                  QUIZ
                </span>
              </div>

              <p className="text-xs font-light">+</p>

              <div className="flex flex-col items-center w-[90px]">
                <Image
                  src="/assets/ai.png"
                  alt="ai photo"
                  width={80}
                  height={70}
                  className="object-contain shrink-0"
                />
                <span className="font-light text-black text-[10px]  text-center">
                  AI
                </span>
              </div>

              <p className="text-xs font-light">+</p>

              <div className="flex flex-col items-center w-[90px]">
                <Image
                  src="/assets/stylist.png"
                  alt="stylist photo"
                  width={80}
                  height={70}
                  className="object-contain shrink-0"
                />
                <span className="font-light text-black text-[10px]  text-center">
                  STYLIST
                </span>
              </div>
            </div>
          </div>

          {/* White horizontal line */}
          <hr className="w-full border-t border-gray-400 mt-4" />

          {/* Heading and Paragraph */}
          <div className="flex flex-row justify-between items-start mt-4 gap-4">
            {/* Left Section: Heading + Paragraph */}
            <div className="w-2/3">
              <h1 className="text-[11px] tracking-normal font-semibold mt-2">
                YOUR COLOR ANALYSIS
              </h1>
              <p className="mt-2 font-[Boston] text-[12px] not-italic font-light leading-normal text-xs">
                With your soft undertones and calm personality, light earthy
                tones and minimal pieces enhance your natural ease and elegance.
              </p>
            </div>

            {/* Right Section: Color Boxes in Column */}
            <div className="flex flex-col gap-2 w-1/2 items-end">
              <div
                className="w-[120px] h-[25px]"
                style={{ backgroundColor: "#D8CAB8" }}
              ></div>
              <div
                className="w-[120px] h-[25px] "
                style={{ backgroundColor: "#A3A380" }}
              ></div>
              <div
                className="w-[120px] h-[25px] "
                style={{ backgroundColor: "#E5B299" }}
              ></div>
              <div
                className="w-[120px] h-[25px] "
                style={{ backgroundColor: "#BFBFBF" }}
              ></div>
              <div
                className="w-[120px] h-[25px] "
                style={{ backgroundColor: "#FDF6EC" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stylist;
