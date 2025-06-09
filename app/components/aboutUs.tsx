import Image from "next/image";

const AboutUs = () => {
  return (
    <div>
      <div className="flex flex-col space-x-6 md:flex-row gap-8 items-start max-w-7xl mx-auto  px-8 py-10">
        <div className="md:w-1/2 space-y-6">
          <h1 className=" font-bold sm:flex  sm:items-center sm:justify-center text-4xl md:text-7xl font-['Boston'] ">
            Get to know us
          </h1>
          <p className="font-light text-lg md:text-lg text-left tracking-wider leading-[1.3] m-0">
            I was just trying to buy a pair of shoes,something stylish,
            something that felt like me. But the deeper I went, the more lost I
            felt. Endless tabs. No real guidance. And no idea what would
            actually go with what. By the time I found something I liked, I
            didn't even want it anymore.
            <br />
            <br/>
            
            So I started asking around. Turns out, I wasn't the only one. People
            told me: <br />
            "I never find anything that fits right." <br />
            "I return half the things I buy." <br />
            "I don't know what actually suits me."
            <br />
            <br/>
            That's when it clicked,it's not the people who are the problem.
            It's the system.
            <br />
            <br/>
            We created MyMirro to change that. MyMirro isn't about transactions.
            It's about transformation,into someone who feels confident,
            stylish, and completely themselves. <br />
            <br />
            We're not just another marketplace. We're your fashion partner.{" "}
            <br />
           <br/>
            And this is just the beginning.
          </p>
        </div>

        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/assets/about-1.png"
            alt="About MyMirro"
            className="w-full max-w-[600px] bg-yellow-300 md:w-[79%] h-[300px] sm:h-[400px] md:h-[600px] object-cover rounded-lg"
          />
        </div>
      </div>

      {/*nex section*/}
      <div className="flex flex-col mt-2 space-x-6 md:flex-row gap-8 items-start max-w-7xl mx-auto px-8 py-4">
        <div className="md:w-1/2 space-y-2">
          <h1 className="font-['Boston'] text-3xl md:text-7xl font-bold text-left">
            Our mission
          </h1>
          <p className=" pt-4 leading-tight text-lg font-light font-['Boston'] md:text-lg text-left">
            At MyMirro, we don't just sell clothes,we help you express yourself
            through fashion. Shopping should be exciting, effortless, and
            tailored to you. Our goal is to be your personal fashion stylist,
            ensuring that you always look and feel your best.
            <br />
            <br />
            We understand that online shopping can feel overwhelming,so much
            choice, yet never quite what you're looking for. That's why we
            handpick outfits based on your unique preferences, body type, and
            style. Whether you need guidance, don't have the time, or simply
            want a better way to shop,we've got you covered.
          </p>
        </div>
        <div className="w-full md:w-1/2  ">
          <h1 className="font-['Boston'] text-3xl md:text-7xl font-bold text-left">
            What makes us different?
          </h1>
          <p className=" text-lg font-light tracking-wide leading-[1.2] font-['Boston'] pt-7 md:text-lg text-left">
            Unlike other platforms, MyMirro isn't just another shopping site. We
            offer:
            <br /> - Personalized fashion advice,real designers helping you
            style yourself effortlessly. <br />- Curated recommendations,you'll
            only see outfits that truly match your style and personality.
            <br /> - Time-saving simplicity,no more endless scrolling, just the
            best picks for you.
          </p>
        </div>
      </div>

      {/* Image section */}
      <div className="relative mt-10 w-screen left-[50%] right-[50%] mx-[-50vw] lg:h-screen">
        <div className="w-full h-full">
          <Image
            src="/assets/about-2.png"
            alt="MyMirro"
            width={2000}
            height={800}
            className="w-full h-[300px] sm:h-[500px] md:h-[500px] lg:h-screen xl:h-screen object-cover"
            priority
          />
        </div>
      </div>

      {/*team section*/}
      <div>
        <div className="flex flex-col mt-15  justify-between px-8">
          <h1 className="font-['Boston']  test-left md:text-7xl font-bold text-3xl">
            Our Team
          </h1>
          <p className="pt-4 font-['Boston'] font-light leading-6 text-lg">
            Our strength lies in our individuality. We're a passionate team of
            four individuals who <br />
            love fashion, technology, and solving real problems. Our diverse
            expertise allows us to
            <br /> craft an experience that feels personal, fun, and
            effortless—just the way shopping
            <br />
            should be!
          </p>
        </div>
      </div>

      {/*founders section*/}
      <div className="px-4 mt-15 sm:px-2">
        {" "}
        {/* Container with side padding */}
        <div className="grid  sm:grid-cols-4 gap-3 sm:gap-5 mt-10">
          {/* Mayank bhaiya ka Image 1 */}
         
          <div className="aspect-square flex-col space-y-2 rounded-lg">
            <Image
              src="/assets/mayanksir.jpg"
              alt="Mayank Bhaiya"
              width={300}
              height={300}
              className="w-full h-[300px] max-w-[350px] mx-auto object-cover hover:scale-105 transition-transform duration-300"
            />

            <p className="text-lg font-semibold px-6">Mayank</p>
            <p className="text-lg text-black px-6">Chief Executive Officer</p>
          </div>

          {/* Piyush bahiya ka Image 2 */}
          <div className="aspect-square flex-col space-y-2 rounded-lg">
            <Image
              src="/assets/ppiyush.avif"
              alt="Piyush bhaiya"
              width={300}
              height={300}
              className="w-90 h-[300] max-w-[350px]  mx-auto object-cover hover:scale-105 transition-transform duration-300"
            />
             <p className="text-lg font-semibold px-6">Piyush Pratap Singh</p>
            <p className="text-lg text-black px-6">Chief Business Officer</p>
          </div>

          {/* Akhil bhaiya ka Image 3 */}
          <div className="aspect-square flex-col space-y-2 rounded-lg">
            <Image
              src="/assets/akhilBhaiya.avif"
              alt="Akhil bhaiya"
              width={300}
              height={300}
              className="w-full h-[300] max-w-[350px]  mx-auto   object-cover hover:scale-105 transition-transform duration-300"
            />
             <p className="text-lg font-semibold px-6">Akhil Singh</p>
            <p className="text-lg text-black px-6 ">Chief Technology Officer</p>
            
          </div>

          {/* Harshit bhaiya ka Image 4 */}
          <div className="aspect-square flex-col space-y-2 rounded-lg mb-15">
            <Image
              src="/assets/harshit.jpg"
              alt="Harshit bhiya"
              width={300}
              height={300}
              className="w-full h-[300] max-w-[350px]  mx-auto    object-cover hover:scale-105 transition-transform duration-300"
            />
             <p className="text-lg font-semibold px-6">Harshit</p>
            <p className="text-lg text-black px-6">Chief Experience & Operations Officer</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AboutUs;
