const features = [
  {
    title: "Fashion Made Effortless",
    text: "MyMirro delivers handpicked looks,\ncurated just for you",
    image: "/assets/home1.jpeg",
    imageAlt: "Feature 1",
    textAlign: "left",
  },
  {
    title: "Too many choices, yet nothing to\nwear?",
    text: "We simplify style.\nGet personalized outfits without the stress.",
    image: "/assets/home2.jpeg",
    imageAlt: "Feature 2",
    textAlign: "right",
  },
  {
    title: "Not sure what's trending or what suits you?",
    text: "Our fashion experts handpick styles tailored to you",
    image: "/assets/home3.jpeg",
    imageAlt: "Feature 3",
    textAlign: "left",
  },
];

const HomeFeatureSection = () => (
  <section className="py-14 bg-white w-full p-4">
    <div className="max-w-7xl mx-auto px-2">
      <h2 className="text-3xl font-bold text-center mb-6" aria-label="Features"></h2>
      {features.map((feature, idx) => (
        <div
          key={idx}
          className={`flex flex-col md:flex-row items-center mb-10 gap-8 md:gap-15 px-3 ${
            idx % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Text Column */}
          <div
            className={`md:w-3/5 mt-2 md:mt-0 space-y-2 ${
              feature.textAlign === "right"
                ? "md:pr-12 flex flex-col items-end text-right"
                : "md:pl-15 text-left"
            }`}
          >
            <h3 className={`text-4xl md:text-6xl font-bold hover:text-gray-700 transition-colors duration-300`}>{feature.title}</h3>
            <p className="font-light text-sm whitespace-pre-line">{feature.text}</p>
          </div>
          {/* Image Column */}
          <div className="w-full md:w-2/5">
            <img
              src={feature.image}
              alt={feature.imageAlt}
              className="w-full h-[350px] md:h-[500px] object-cover rounded-lg transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default HomeFeatureSection; 